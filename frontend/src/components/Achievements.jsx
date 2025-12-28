import React from "react";

const achievements = [
  { id: 1, title: "First Sun", unlocked: true },
  { id: 2, title: "Super Suns", unlocked: false},
  { id: 3, title: "Sun Hacker", unlocked: false},
  { id: 4, title: "Master of Suns", unlocked: false},
  { id: 5, title: "Sun God", unlocked: false},
  { id: 6, title: "Energy Boost", unlocked: false },
  { id: 7, title: "Study Master", unlocked: false },
  { id: 8, title: "Super Focus", unlocked: false },
  { id: 9, title: "Productivity Pro", unlocked: false },
  { id: 10, title: "Mind Garden Expert", unlocked: false },
];

const Achievements = () => {
  return (
    <div className="p-4 w-full md:w-3/4 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">Achievements</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`flex flex-col items-center justify-center p-3 rounded-lg shadow-md transition-transform transform ${
              ach.unlocked
                ? "bg-primary text-primary-content hover:scale-105"
                : "bg-base-200 text-base-content/50"
            }`}
          >
            {/* Icon placeholder */}
            <div className="w-10 h-10 mb-2 rounded-full bg-base-300 flex items-center justify-center text-sm font-bold">
              {ach.unlocked ? <span className="text-green-500">✓</span> : "?"}
            </div>

            {/* Name visible only if unlocked */}
            <span className="text-sm text-center">
              {ach.unlocked ? ach.title : "???"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
