import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import TimerPage from "./pages/TimerPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EnergyPage from "./pages/EnergyPage.jsx";

const THEME_KEY = "app_theme";

const App = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "coffee";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <Routes>
      <Route
        path="/"
        element={<TimerPage theme={theme} setTheme={setTheme} />}
      />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/shop"
        element={<ShopPage theme={theme} setTheme={setTheme} />}
      />
      <Route
        path="/stats"
        element={<StatsPage theme={theme} setTheme={setTheme} />}
      />

      <Route 
        path="/energy"
        element={< EnergyPage theme={theme} setTheme={setTheme} />}
      />
    </Routes>
  );
};

export default App;
