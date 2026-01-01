import Stat from '../components/Stat.jsx';
import Navbar from '../components/Navbar.jsx';
import Achievements from '../components/Achievements.jsx';
import React, { useState, useEffect } from 'react';


const StatsPage = ({ theme,  setTheme }) => {

    const [user, setUser] = useState(null);
  
    useEffect(() =>{
  
      const fetchCurrentUser = async () => {
        try {
          const res = await fetch("http://localhost:5001/api/users/me", {
            credentials: "include"
          });
  
  
          if(!res.ok){
            setUser(null);
            return;
          }
  
          const data = await res.json();
          setUser(data);
        } catch (error) {
          console.error("Failed to fetch current user: ", error);
          setUser(null);
        }
      };
  
      fetchCurrentUser();
    }, []);
  

  return (
    <div className='items-center'>
      <Navbar theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
      <Stat />
      <Achievements />
    </div>
  )
}

export default StatsPage;
