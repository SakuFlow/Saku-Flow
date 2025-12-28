import React, { useState } from 'react'
import { Routes, Route } from 'react-router'
import TimerPage from './pages/TimerPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import toast from 'react-hot-toast';
import ThemeController from './components/ThemeController.jsx'


const App = () => {

  const [theme, setTheme] = useState("coffee");
  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={<TimerPage theme={theme} setTheme={setTheme} />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </div>
    
  )
}

export default App