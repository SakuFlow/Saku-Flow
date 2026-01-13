import React, { useState, useRef, useEffect } from "react";

async function authFetch(url, options = {}) {
  options.credentials = "include";
  let res = await fetch(url, options);

  if (res.status === 401) {
    const refreshRes = await fetch(
      "http://localhost:5001/api/users/auth/refresh",
      { method: "POST", credentials: "include" }
    );
    if (refreshRes.ok) {
      res = await fetch(url, options);
    } else {
      throw new Error("Session expired. Please log in again");
    }
  }

  return res.json();
}

const TIMER_KEY = "pomodoro_timer";

const saveTimer = (data) =>
  localStorage.setItem(TIMER_KEY, JSON.stringify(data));

const loadTimer = () =>
  JSON.parse(localStorage.getItem(TIMER_KEY) || "null");

const clearTimer = () => localStorage.removeItem(TIMER_KEY);

const TimerComponent = () => {
  const shortSession = 25 * 60;
  const longSession = 50 * 60;
  const shortBreak = 5 * 60;
  const longBreak = 10 * 60;

  const [suns, setSuns] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [timeLeft, setTimeLeft] = useState(longSession);

  const intervalRef = useRef(null);

  // Helper to get timer state from localStorage
  const getTimerFromStorage = () => {
    const stored = loadTimer();
    if (!stored) return {
      isBreak: false,
      isLongSession: true,
      pendingBreak: false,
      endTime: null,
      timeLeft: longSession,
    };

    const { isBreak, isLongSession, pendingBreak, endTime } = stored;

    let computedTimeLeft = 0;

    if (endTime) {
      computedTimeLeft = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
    } else if (pendingBreak) {
      computedTimeLeft = isLongSession ? longBreak : shortBreak;
    } else {
      computedTimeLeft = isBreak
        ? isLongSession
          ? longBreak
          : shortBreak
        : isLongSession
        ? longSession
        : shortSession;
    }

    return { ...stored, timeLeft: computedTimeLeft };
  };

  const startTimer = () => {
    const timer = getTimerFromStorage();
    if (intervalRef.current) return;

    const endTime = Date.now() + timer.timeLeft * 1000;

    saveTimer({
      ...timer,
      endTime,
      pendingBreak: false,
    });

    intervalRef.current = setInterval(() => {
      const updatedTimer = getTimerFromStorage();
      setTimeLeft(updatedTimer.timeLeft);

      if (updatedTimer.endTime && updatedTimer.timeLeft <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        handleSessionComplete();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    const timer = getTimerFromStorage();
    saveTimer({
      ...timer,
      endTime: null,
      pendingBreak: false,
    });

    const duration = timer.isBreak
      ? timer.isLongSession
        ? longBreak
        : shortBreak
      : timer.isLongSession
      ? longSession
      : shortSession;

    setTimeLeft(duration);
  };

  const handleSessionComplete = async () => {
    const timer = getTimerFromStorage();

    const nextIsBreak = !timer.isBreak;
    const nextDuration = nextIsBreak
      ? timer.isLongSession
        ? longBreak
        : shortBreak
      : timer.isLongSession
      ? longSession
      : shortSession;

    if (!timer.isBreak) {
      try {
        const data = await authFetch("http://localhost:5001/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ time: (timer.isLongSession ? longSession : shortSession) }),
        });
        setSuns(data.suns);
        setEnergy(data.energy);
      } catch (error) {
        console.error(error);
      }
    }

    saveTimer({
      isBreak: nextIsBreak,
      isLongSession: timer.isLongSession,
      pendingBreak: nextIsBreak,
      endTime: null,
    });

    setTimeLeft(nextDuration);
  };

  const handleTimerLength = () => {
    const timer = getTimerFromStorage();
    const newIsLongSession = !timer.isLongSession;

    saveTimer({
      ...timer,
      isLongSession: newIsLongSession,
      endTime: null,
    });

    setTimeLeft(
      timer.isBreak
        ? newIsLongSession
          ? longBreak
          : shortBreak
        : newIsLongSession
        ? longSession
        : shortSession
    );
  };

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authFetch("http://localhost:5001/api/stats");
        setSuns(data.suns);
        setEnergy(data.energy);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  // Load timer from localStorage on mount
  useEffect(() => {
    const timer = getTimerFromStorage();
    setTimeLeft(timer.timeLeft);

    if (timer.endTime) {
      intervalRef.current = setInterval(() => {
        const updatedTimer = getTimerFromStorage();
        setTimeLeft(updatedTimer.timeLeft);

        if (updatedTimer.endTime && updatedTimer.timeLeft <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          handleSessionComplete();
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getCurrentDuration = () => {
    const timer = getTimerFromStorage();
    return timer.isBreak
      ? timer.isLongSession
        ? longBreak
        : shortBreak
      : timer.isLongSession
      ? longSession
      : shortSession;
  };

  const getSteps = () => Math.min(getCurrentDuration(), 4);

  const displayTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const timer = getTimerFromStorage(); // derived for UI

  return (
    <div className="flex flex-col items-center gap-8 text-base-content font-mono p-2 pt-20 min-h-0">
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl p-4 bg-base-300 border border-base-content/20 shadow-xl rounded-2xl">
        <div className="flex-1 p-5 bg-base-200 border border-base-content/20 rounded-xl flex flex-col gap-4">
          <ul className="steps steps-horizontal gap-2">
            {[...Array(getSteps())].map((_, index) => {
              const currentDuration = getCurrentDuration();
              const stepsCount = getSteps();
              const stepLength = currentDuration / stepsCount;
              const stepIndex = Math.max(
                0,
                stepsCount - Math.ceil(timeLeft / stepLength)
              );
              const isActive = index <= stepIndex;

              return (
                <li
                  key={index}
                  className={`step ${isActive ? "step-primary" : ""}`}
                >
                  {Math.floor((stepLength * (index + 1)) / 60).toFixed(0)} min
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between items-center mt-4">
            <p className="text-success font-semibold">
              {timer.isBreak ? "Break" : "Work"} Timer
            </p>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={timer.isLongSession}
              disabled={intervalRef.current !== null || timer.isBreak}
              onChange={handleTimerLength}
            />
          </div>

          <p className="text-warning text-right font-bold mt-2">
            {suns}☀️ | {energy}⚡
          </p>
        </div>

        <div className="flex-1 p-5 bg-base-200 border border-base-content/20 rounded-xl flex flex-col items-center gap-4">
          <h1 className="text-6xl text-primary font-bold">
            {displayTime(timeLeft)}
          </h1>
          <div className="flex gap-4 mt-6">
            <button
              className="btn btn-success"
              onClick={startTimer}
              disabled={intervalRef.current !== null}
            >
              Start
            </button>
            <button className="btn btn-error" onClick={stopTimer}>
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerComponent;
