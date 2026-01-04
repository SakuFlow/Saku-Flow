import React, { useState, useEffect } from "react";

const SHOP_ITEMS = [
  { id: 1, displayName: "Golden Sun", upgradeName: "golden_sun", description: "coming soon...", basePrice: 10, priceMultiplier: 1.2 },
  { id: 2, displayName: "Energy Drink", upgradeName: "energy_drink", description: "Coming soon...", basePrice: 50, priceMultiplier: 1.3 },
  { id: 3, displayName: "Study Book", upgradeName: "study_book", description: "Comming soon..", basePrice: 100, priceMultiplier: 1.4 },
  { id: 4, displayName: "Magic Plant", upgradeName: "magic_plant", description: "Coming soon..", basePrice: 200, priceMultiplier: 1.5 },
  { id: 5, displayName: "Solar Panel", upgradeName: "solar_panel", description: "Coming soon...", basePrice: 1000, priceMultiplier: 1.6 },
];


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


const Card = () => {
  const [upgrades, setUpgrades] = useState({});
  const [suns, setSuns] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [loadingItem, setLoadingItem] = useState(null); // track which item is being bought
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authFetch("http://localhost:5001/api/stats", {
          credentials: "include"
        });

        setSuns(data.suns || 0);
        setEnergy(data.energy || 0);
        setUpgrades(data.upgrades || {});
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Handle buying an upgrade
  const buyUpgrade = async (item) => {
    setError(null);
    setLoadingItem(item.upgradeName);

    try {
      const data = await authFetch("http://localhost:5001/api/upgrades/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ upgradeName: item.upgradeName }),
      });

      // Update state with new upgrades and suns
      setUpgrades(data.upgrades);
      setSuns(data.suns);
    } catch (err) {
      console.error("Error buying upgrade:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoadingItem(null);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Shop</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>} 
      <p className="text-center mb-6">
        Suns: <strong>{suns}</strong> | Energy: <strong>{energy}</strong>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {SHOP_ITEMS.map((item) => {
          const level = upgrades[item.upgradeName] || 0;
          const price = Math.floor(item.basePrice * Math.pow(item.priceMultiplier, level));
          const canBuy = suns >= price && !loadingItem;

          return (
            <div
              key={item.upgradeName}
              className="bg-base-200 shadow-lg rounded-xl p-6 flex flex-col justify-between w-[15rem]  mx-auto"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 text-center">{item.displayName}</h2>
                <p className="text-sm mb-2 text-center">{item.description}</p>
                <p className="text-sm mb-1 text-center">
                  Level: <strong>{level}</strong>
                </p>
                <p className="text-sm mb-4 text-center">
                  Price: <strong>{price}</strong> suns
                </p>
              </div>

              <button
                className="btn btn-primary btn-sm self-center"
                onClick={() => buyUpgrade(item)}
                disabled={!canBuy || loadingItem === item.upgradeName}
              >
                {loadingItem === item.upgradeName ? "Buying..." : "Buy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default Card;
