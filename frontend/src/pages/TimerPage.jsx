import React from 'react'
import Navbar from '../components/Navbar.jsx'
import TimerComponent from '../components/TimerComponent.jsx'
import ThemeController from '../components/ThemeController.jsx'

const TimerPage = ({ theme,  setTheme }) => {
  return (
    <div className="min-h-screen">
      <Navbar setTheme={setTheme} />
      <TimerComponent />
    </div>
  )
}


export default TimerPage