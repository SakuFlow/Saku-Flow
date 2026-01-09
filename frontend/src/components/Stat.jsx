import React, { useState, useEffect } from "react";

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

const Stat = ({ suns, energy, overall }) => {


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
