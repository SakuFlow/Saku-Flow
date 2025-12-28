import React from 'react';
import ThemeController from './ThemeController';

const Navbar = ({theme,  setTheme }) => {
  return (
    <header className="relative w-full bg-base-300 border-b border-base-content/20 shadow-inner p-4 text-center">

      <div className="absolute right-4 top-4">
        <ThemeController theme={theme} setTheme={setTheme} />
      </div>

      <h1 className="text-2xl font-bold">Pomodoro Timer</h1>

      <ul className="menu menu-horizontal rounded-box bg-base-100 mt-2 inline-flex">
        <li><a href="#timer">Timer</a></li>
        <li><a href="#pflanzen">Pflanzen</a></li>
        <li><a href="/shop">Shop</a></li>
        <li><a href="#statistiken">Statistiken</a></li>
        <li><a href="#memoryChamber">Memory Chamber</a></li>
      </ul>
    </header>
  );
};

export default Navbar;
