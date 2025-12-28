import React from 'react'
import Stat from '../components/Stat.jsx';
import Navbar from '../components/Navbar.jsx';
import Achievements from '../components/Achievements.jsx';


const StatsPage = ({ theme,  setTheme }) => {
  return (
    <div className='items-center'>
      <Navbar setTheme={setTheme} />
      <Stat></Stat>
      <Achievements></Achievements>
    </div>
  )
}

export default StatsPage;
