import React, { useRef, useState, useEffect } from 'react';

const TimerComponent = () => {

  const shortSession = 25 * 60;
  const longSession = 50 * 60; 

  const [timeLeft, setTimeLeft] = useState(longSession);
  const [isLongSession, setIsLongSession] = useState(true);
  const intervalRef = useRef(null);
  const duration = isLongSession ? longSession : shortSession;

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current === null) {
      setTimeLeft(duration);
    }
  }, [duration]);

  const startTimer = () => {
    if(intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if(prev <= 1){
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if(intervalRef.current === null) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimeLeft(duration);
  };

  const displayTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };


  return (
    <div className="flex flex-col items-center gap-8 text-base-content font-mono p-6 pt-20 min-h-0">

      {/* MAIN CARD */}
      <div className="flex flex-col md:flex-row gap-7 w-full max-w-4xl p-6 bg-base-300 border border-base-content/20 shadow-xl rounded-2xl">

        {/* STATUS BAR */}
        <div className="flex-1 p-5 bg-base-200 border border-base-content/20 rounded-xl flex flex-col gap-4">
          <ul className="steps steps-horizontal gap-2">
            <li className="step step-primary">10 min</li>
            <li className="step step-primary">20 min</li>
            <li className="step">30 min</li>
            <li className="step">40 min</li>
            <li className="step">50 min</li>
          </ul>

          <div className="flex justify-between items-center mt-4">
            <p className="text-success font-semibold">
              Aktiv: {isLongSession ? "50min" : "25min"} Timer
            </p>

            <input 
              id="toggleSwitch"
              type="checkbox"
              className="toggle toggle-primary"
              checked={isLongSession}
              disabled={intervalRef.current !== null}
              onChange={(e) => setIsLongSession(e.target.checked)}
            />
          </div>

          <p id="suns" className="text-warning text-right font-bold mt-2">
            0☀️
          </p>
        </div>

        {/* TIMER */}
         <div className="flex-1 p-5 items-center bg-base-200 border border-base-content/20 rounded-xl flex flex-col gap-4">
          <h1 id="timer" className="text-6xl text-primary font-bold">{displayTime(timeLeft)}</h1>

          <div className="flex gap-4 mt-6">
            <button className="btn btn-success" onClick={startTimer}>
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
}

export default TimerComponent;
