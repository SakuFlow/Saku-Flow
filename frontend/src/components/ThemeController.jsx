import React from 'react'

const ThemeController = ({ setTheme }) => {
  const handleChange = (e) => {
    const selected = e.target.value;
    setTheme(selected);     
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
      </div>

      <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box w-52 p-2 shadow-2xl">
        {["coffee", "synthwave", "retro", "aqua", "dracula"].map((t) => (
          <li key={t}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={t}
              value={t}
              onChange={handleChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeController;