import React, { useEffect, useState } from "react";

const Achievements = () => {

  const [unlockedMap, setUnlockedMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/achievements", {
          credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to fetch achievements");

        const data = await res.json();
        setUnlockedMap(data.achievements || {});
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
        setUnlockedMap({});
      } finally {
        setLoading(false);
      }
    };

  fetchAchievements();
}, []);

  const ACHIEVEMENT_DEFS = [
    { id: "first_sun", title: "First Sun" },
    { id: "super_suns", title: "Super Suns" },
    { id: "sun_hacker", title: "Sun Hacker" },
    { id: "master_of_suns", title: "Master of Suns" },
    { id: "sun_god", title: "Sun God" },
    { id: "energy_boost", title: "Energy Boost" },
    { id: "study_master", title: "Study Master" },
    { id: "super_focus", title: "Super Focus" },
    { id: "productivity_pro", title: "Productivity Pro" },
    { id: "mind_garden_expert", title: "Mind Garden Expert" }
  ];

  if (loading) {
    return <p className="text-center">Loading achievements…</p>;
  }

    return (
    <div className="p-4 w-full md:w-3/4 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">Achievements</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {ACHIEVEMENT_DEFS.map((ach) => {
          const unlocked = !!unlockedMap[ach.id];

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
                  {unlocked ? <span className="text-green-500">✓</span> : "?"}
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
