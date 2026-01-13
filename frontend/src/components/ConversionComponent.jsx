import React, { useState, useEffect } from 'react';

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

const ConversionComponent = ({ maxEnergy, setMaxEnergy }) => {
  const MIN = 50;
  const CONVERSION_RATE = 1.4;

  const [energyToConvert, setEnergyToConvert] = useState(Math.min(MIN, maxEnergy));

  const disabled = maxEnergy < MIN;

  useEffect(() => {
    setEnergyToConvert(prev => Math.min(prev, maxEnergy));
  }, [maxEnergy]);

  const sunsGained = Math.round(energyToConvert * CONVERSION_RATE);

  const handleChange = (e) => {
    const value = Math.round(Number(e.target.value));
    setEnergyToConvert(Math.max(MIN, Math.min(value, maxEnergy)));
  };

  const fetchConvertEnergy = async () => {
    try {
      const data = await authFetch("http://localhost:5001/api/stats/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convertedEnergy: energyToConvert }),
      });

      if (data.energy !== undefined) setMaxEnergy(data.energy);

      setEnergyToConvert(Math.max(MIN, Math.min(data.energy, maxEnergy)));
    } catch (error) {
      console.error("Failed to fetch energy:", error);
      alert(error.message || "Energy conversion failed");
    }
  };

  return (
    <div className="flex justify-center items-center w-full mt-10">
      <div className="bg-base-200 rounded-2xl shadow-xl p-6 w-full max-w-md text-center space-y-6">

        <h2 className="text-2xl font-bold text-primary">
          Energy Conversion
        </h2>

        <p className="text-sm text-base-content/70">
          Convert your energy to get more suns
        </p>

        {/* Slider */}
        <input
          type="range"
          min={MIN}
          max={maxEnergy}
          step={1}
          value={energyToConvert}
          disabled={disabled}
          onChange={handleChange}
          className="range range-primary"
        />

        {/* Output */}
        <div className="bg-base-100 rounded-xl p-4 shadow-inner space-y-2">
          <div className="flex justify-between text-sm">
            <span>Energy Used</span>
            <span className="font-semibold">{energyToConvert}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Suns Gained</span>
            <span className="font-semibold text-warning">
              +{sunsGained}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          className="btn btn-primary w-full"
          disabled={disabled}
          onClick={fetchConvertEnergy}
        >
          Convert Energy
        </button>

        {disabled && (
          <p className="text-xs text-error">
            You need more than {MIN} energy to convert.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversionComponent;
