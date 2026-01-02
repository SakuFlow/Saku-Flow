import React, { useRef, useState, useEffect } from "react";

async function authFetch(url, options = {}) {
  options.credentials = "include";
  let res = await fetch(url, options);

  if(res.status === 401) {
    const refreshRes = await fetch("http://localhost:5001/api/users/auth/refresh", {
      method: "POST",
      credentials: "include"
    });

    if(refreshRes.ok) {
      res = await fetch(url, options);
    } else{
      throw new Error("Session expired. Please log in again");
    }
  }

  return res.json();
}

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

  const intervalRef = useRef(null);

  const duration = isLongSession ? longSession : shortSession;

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current === null) setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authFetch("http://localhost:5001/api/stats");
        setSuns(data.suns);
        setEnergy(data.energy);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      handleSessionComplete();
    }
  }, [timeLeft]);

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimeLeft(duration);
  };

  const handleSessionComplete = async () => {
    if (!isBreak) {
      // Update stats only for work sessions
      try {
        const data = await authFetch("http://localhost:5001/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ overall: duration }),
        });
        setSuns(data.suns);
        setEnergy(data.energy);
      } catch (error) {
        console.error(error);
      }
    }

    const newIsBreak = !isBreak;
    setIsBreak(newIsBreak);
    setTimeLeft(
      newIsBreak
        ? isLongSession
          ? longBreak
          : shortBreak
        : isLongSession
        ? longSession
        : shortSession
    );
  };

  const getSteps = () => {
    const currentDuration = isBreak
      ? isLongSession
        ? longBreak
        : shortBreak
      : isLongSession
      ? longSession
      : shortSession;
    return Math.min(currentDuration, 5); 
  };

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
              const currentDuration = isBreak
                ? isLongSession
                  ? longBreak
                  : shortBreak
                : isLongSession
                ? longSession
                : shortSession;

              const stepsCount = getSteps();
              const stepLength = currentDuration / stepsCount;
              const isActive = index <= stepsCount - Math.ceil(timeLeft / stepLength);

              return (
                <li key={index} className={`step ${isActive ? "step-primary" : ""}`}>
                  {Math.round(stepLength * (index + 1)) /*/ 60 */} min
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between items-center mt-4">
            <p className="text-success font-semibold">
              {isBreak ? "Break" : "Work"} Timer
            </p>

            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isLongSession}
              disabled={intervalRef.current !== null}
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
