import React, { useState, useEffect } from "react";


const Stat = () => {

  const [suns, setSuns] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
      const fetchStats = async () => {
        try {
          const res = await fetch("http://localhost:5001/api/stats", {
            credentials: "include"
          });
          if(!res.ok) throw new Error("Failed to fetch stats");
  
          const data = await res.json();
  
          setSuns(data.suns || 0);
          setEnergy(data.energy || 0);
          setOverall(data.overall || 0);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        }
      };
  
      fetchStats();
    }, []);

  return (
    <div className="stats shadow-lg rounded-xl bg-base-100 p-4 w-full md:w-3/4 mx-auto gap-4">
      {/* Suns */}
      <div className="stat place-items-center p-4 rounded-lg shadow-md bg-base-200 hover:scale-105 transform transition-all duration-200">
        <div className="stat-title text-lg font-semibold">Suns</div>
        <div className="stat-value text-3xl text-primary">{suns}</div>
      </div>

      {/* Energy */}
      <div className="stat place-items-center p-4 rounded-lg shadow-md bg-base-200 hover:scale-105 transform transition-all duration-200">
        <div className="stat-title text-lg font-semibold">Energy</div>
        <div className="stat-value text-3xl text-secondary">{energy}</div>
      </div>

      {/* Study Time */}
      <div className="stat place-items-center p-4 rounded-lg shadow-md bg-base-200 hover:scale-105 transform transition-all duration-200">
        <div className="stat-title text-lg font-semibold">Study Time</div>
        <div className="stat-value text-3xl text-accent">{overall}</div>
      </div>
    </div>
  );
};

export default Stat;
