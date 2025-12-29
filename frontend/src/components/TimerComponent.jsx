import React from 'react';

const TimerComponent = () => {
  return (
    <div className="flex flex-col items-center gap-8 bg-base-200 text-base-content font-mono p-6 pt-20 min-h-screen">

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
            <p id="sessionMode" className="text-success font-semibold">
              Aktiv: 50min Timer
            </p>

            <input 
              id="toggleSwitch"
              type="checkbox"
              className="toggle toggle-primary"
            />
          </div>

          <p id="suns" className="text-warning text-right font-bold mt-2">
            0☀️
          </p>
        </div>

        {/* TIMER */}
         <div className="flex-1 p-5 items-center bg-base-200 border border-base-content/20 rounded-xl flex flex-col gap-4">
          <h1 id="timer" className="text-6xl text-primary font-bold">50:00</h1>

          <div className="flex gap-4 mt-6">
            <button className="btn btn-success" onClick={() => console.log("startTimer()")}>
              Start
            </button>
            <button className="btn btn-error" onClick={() => console.log("stopTimer()")}>
              Stop
            </button>
          </div>
        </div>

      </div>

      {/* TODO BUTTON */}
      <button id="todoButton" className="btn btn-accent px-12 py-3">
        ADD TODO
      </button>

    </div>
  );
}

export default TimerComponent;
