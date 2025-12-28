import React from "react";

const Stat = () => {
  return (
    <div className="stats shadow-lg rounded-xl bg-base-100 p-4 w-full md:w-3/4 mx-auto gap-4">
      {/* Suns */}
      <div className="stat place-items-center p-4 rounded-lg shadow-md bg-base-200 hover:scale-105 transform transition-all duration-200">
        <div className="stat-title text-lg font-semibold">Suns</div>
        <div className="stat-value text-3xl text-primary">0</div>
      </div>

      {/* Energy */}
      <div className="stat place-items-center p-4 rounded-lg shadow-md bg-base-200 hover:scale-105 transform transition-all duration-200">
        <div className="stat-title text-lg font-semibold">Energy</div>
        <div className="stat-value text-3xl text-secondary">0</div>
      </div>

      {/* Study Time */}
      <div className="stat place-items-center p-4 rounded-lg shadow-md bg-base-200 hover:scale-105 transform transition-all duration-200">
        <div className="stat-title text-lg font-semibold">Study Time</div>
        <div className="stat-value text-3xl text-accent">0</div>
      </div>
    </div>
  );
};

export default Stat;
