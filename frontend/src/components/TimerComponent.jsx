import React, { useRef, useState, useEffect } from "react";

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

const saveTimer = (data) => localStorage.setItem(TIMER_KEY, JSON.stringify(data));
const loadTimer = () => JSON.parse(localStorage.getItem(TIMER_KEY) || "null");
const clearTimer = () => localStorage.removeItem(TIMER_KEY);

const TimerComponent = () => {
  const shortSession = 5;
  const longSession = 10;
  const shortBreak = 2;
  const longBreak = 4;

  const [suns, setSuns] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [timeLeft, setTimeLeft] = useState(longSession);
  const [isLongSession, setIsLongSession] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [pendingBreak, setPendingBreak] = useState(false);

  const intervalRef = useRef(null);

  const getCurrentDuration = () =>
    isBreak ? (isLongSession ? longBreak : shortBreak) : isLongSession ? longSession : shortSession;

  const tick = () => {
    const stored = loadTimer();
    if (!stored || !stored.endTime) return;

    const remaining = Math.ceil((stored.endTime - Date.now()) / 1000);

    if (remaining <= 0) {
      setTimeLeft(0);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      handleSessionComplete();
    } else {
      setTimeLeft(remaining);
    }
  };

  // fetch stats on mount
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

  // load timer from localStorage
  useEffect(() => {
    const stored = loadTimer();
    if (!stored) return;

    setIsBreak(stored.isBreak);
    setIsLongSession(stored.isLongSession);
    setPendingBreak(stored.pendingBreak || false);

    if (stored.endTime) {
      const remaining = Math.ceil((stored.endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
        intervalRef.current = setInterval(tick, 1000);
      } else if (stored.pendingBreak) {
        // break pending but not started
        setTimeLeft(stored.isLongSession ? longBreak : shortBreak);
      }
    } else if (stored.pendingBreak) {
      setTimeLeft(stored.isLongSession ? longBreak : shortBreak);
    } else {
      setTimeLeft(getCurrentDuration());
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // handle toggling long/short session when timer not running
  useEffect(() => {
    if (intervalRef.current || isBreak) return;

    const nextDuration = isLongSession ? longSession : shortSession;
    setTimeLeft(nextDuration);

    const stored = loadTimer();
    if (stored) saveTimer({ ...stored, isLongSession });
  }, [isLongSession]);

  const startTimer = () => {
    if (intervalRef.current) return;

    const endTime = Date.now() + timeLeft * 1000;
    saveTimer({
      endTime,
      isBreak,
      isLongSession,
      pendingBreak: false, 
    });
    setPendingBreak(false);

    intervalRef.current = setInterval(tick, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    clearTimer();
    setTimeLeft(getCurrentDuration());
    setPendingBreak(false);
  };

  const handleSessionComplete = async () => {
    clearTimer();
    intervalRef.current = null;

    const nextIsBreak = !isBreak;
    const nextDuration = nextIsBreak ? (isLongSession ? longBreak : shortBreak) : getCurrentDuration();

    if (!isBreak) {
      try {
        const data = await authFetch("http://localhost:5001/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ overall: getCurrentDuration() * 60 }),
        });
        setSuns(data.suns);
        setEnergy(data.energy);
        alert("Work session finished");
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Break finished. Back to work.");
    }

    // mark break as pending if break not started yet
    saveTimer({
      endTime: nextIsBreak ? null : Date.now() + nextDuration * 1000,
      isBreak: nextIsBreak,
      isLongSession,
      pendingBreak: nextIsBreak,
    });
    setIsBreak(nextIsBreak);
    setTimeLeft(nextDuration);
    setPendingBreak(nextIsBreak);
  };

  const getSteps = () => Math.min(getCurrentDuration(), 5);

  const displayTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 text-base-content font-mono p-6 pt-20 min-h-0">
      <div className="flex flex-col md:flex-row gap-7 w-full max-w-4xl p-6 bg-base-300 border border-base-content/20 shadow-xl rounded-2xl">
        <div className="flex-1 p-5 bg-base-200 border border-base-content/20 rounded-xl flex flex-col gap-4">
          <ul className="steps steps-horizontal gap-2">
            {[...Array(getSteps())].map((_, index) => {
              const currentDuration = getCurrentDuration();
              const stepsCount = getSteps();
              const stepLength = currentDuration / stepsCount;
              const stepIndex = Math.max(0, stepsCount - Math.ceil(timeLeft / stepLength));
              const isActive = index <= stepIndex;

              return (
                <li key={index} className={`step ${isActive ? "step-primary" : ""}`}>
                  {Math.round(stepLength * (index + 1))} min
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between items-center mt-4">
            <p className="text-success font-semibold">{isBreak ? "Break" : "Work"} Timer</p>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isLongSession}
              disabled={intervalRef.current !== null || isBreak}
              onChange={(e) => setIsLongSession(e.target.checked)}
            />
          </div>

          <p className="text-warning text-right font-bold mt-2">
            {suns}☀️ | {energy}⚡
          </p>
        </div>

        <div className="flex-1 p-5 bg-base-200 border border-base-content/20 rounded-xl flex flex-col items-center gap-4">
          <h1 className="text-6xl text-primary font-bold">{displayTime(timeLeft)}</h1>
          <div className="flex gap-4 mt-6">
            <button className="btn btn-success" onClick={startTimer} disabled={intervalRef.current !== null}>
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
