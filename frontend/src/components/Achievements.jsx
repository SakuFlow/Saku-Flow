import React, { useEffect, useState } from "react";

async function authFetch(url, options = {}) {
  const finalOptions = {
    ...options,
    credentials: "include",
  };

  let res = await fetch(url, finalOptions);

  if (res.status === 401) {
    const refreshRes = await fetch(
      "/api/users/auth/refresh",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!refreshRes.ok) {
      throw new Error("Session expired. Please log in again.");
    }

    res = await fetch(url, finalOptions);
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

const Achievements = () => {
  const [unlockedMap, setUnlockedMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAchievements = async () => {
      try {
        const data = await authFetch(
          "http://localhost:5001/api/achievements"
        );

        if (!isMounted) return;

        setUnlockedMap(data?.achievements ?? {});
      } catch (error) {
        console.error("Failed to fetch achievements:", error);

        if (isMounted) {
          setUnlockedMap({});
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

  const ACHIEVEMENT_DEFS = [
    { id: "first_sun", title: "First Sun" },
    { id: "sun_seeker", title: "Sun Seeker" },
    { id: "sun_chaser", title: "Sun Chaser" },
    { id: "sun_collector", title: "Sun Collector" },
    { id: "solar_explorer", title: "Solar Explorer" },
    { id: "super_suns", title: "Super Suns" },
    { id: "sun_hacker", title: "Sun Hacker" },
    { id: "master_of_suns", title: "Master of Suns" },
    { id: "solar_legend", title: "Solar Legend" },
    { id: "sun_god", title: "Sun God" },

    { id: "battery_saver", title: "Battery Saver" },
    { id: "watts_up", title: "Watt's up" },
    { id: "overcharged", title: "Overcharged" },
    { id: "full_circuit", title: "Full Circuit" },

    { id: "warm_up", title: "Warm Up" },
    { id: "power_hour", title: "Power Hour" },
    { id: "brain_booster", title: "Brain Booster" },
    { id: "spark_of_focus", title: "Spark Of Focus" },
    { id: "mind_of_steel", title: "Mind of Steel" },
    { id: "infinite_focus", title: "Infinite Foucus" },
    { id: "getting_serious", title: "Getting Serious" },
    { id: "timeless", title: "Timeless" },
    { id: "total_domination", title: "Total Domination" },
    { id: "god_tier_study", title: "God-Tier Study" },
  ];

  if (loading) {
    return <p className="text-center">Loading achievements…</p>;
  }

  return (
    <div className="p-4 w-full md:w-3/4 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Achievements
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {ACHIEVEMENT_DEFS.map((ach) => {
          const unlocked = Boolean(unlockedMap[ach.id]);

          return (
            <div
              key={ach.id}
              className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-md transition-transform ${
                unlocked
                  ? "bg-primary text-primary-content hover:scale-105"
                  : "bg-base-200 text-base-content/50"
              }`}
            >
              <div className="w-10 h-10 mb-2 rounded-full bg-base-300 flex items-center justify-center text-sm font-bold">
                {unlocked ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  "?"
                )}
              </div>

              <span className="text-sm text-center">
                {unlocked ? ach.title : "???"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
