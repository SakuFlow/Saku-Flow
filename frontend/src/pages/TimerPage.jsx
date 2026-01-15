import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import TimerComponent from '../components/TimerComponent.jsx'
import ThemeController from '../components/ThemeController.jsx'
import TodoComponent from '../components/TodoComponent.jsx'

const TimerPage = ({ theme,  setTheme }) => {
  const [user, setUser] = useState(null);

  useEffect(() =>{

    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/users/me", {
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
    <div className="min-h-screen">
      <Navbar theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
      <TimerComponent />
      <TodoComponent user={user} />
    </div>
  )
}


export default TimerPage