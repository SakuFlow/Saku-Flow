import React from "react";
import ThemeController from "./ThemeController";

const Navbar = ({ theme, setTheme, user, setUser }) => {
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/logout", {
        method: "POST",
        credentials: "include"
      });

      if(!res.ok) throw new Error("logout failed");

      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="relative w-full bg-base-300 border-b border-base-content/20 shadow-inner p-4 text-center">
      {/* Left side: Login or Username */}
      <div className="absolute left-4 top-4">
        {user ? (
          <button onClick={handleLogout} className="btn btn-link p-0 text-sm">
            Log out
          </button>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>

      {/* Right side: Theme */}
      <div className="absolute right-4 top-4">
        <ThemeController theme={theme} setTheme={setTheme} />
      </div>

      <h1 className="text-2xl font-bold">SAKU-FLOW</h1>

      <ul className="menu menu-horizontal rounded-box bg-base-100 mt-2 inline-flex">
        <li>
          <a href="/">Timer</a>
        </li>
        <li>
          <a href="#pflanzen">Pflanzen</a>
        </li>
        <li>
          <a href="/shop">Shop</a>
        </li>
        <li>
          <a href="/stats">Statistiken</a>
        </li>
        <li>
          <a href="#memoryChamber">Memory Chamber</a>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
