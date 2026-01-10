import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Stat from '../components/Stat.jsx';
import ConversionComponent from '../components/ConversionComponent.jsx';


async function authFetch(url, options = {}) {
  options.credentials = "include";
  let res = await fetch(url, options);

  if(res.status === 401) {
    const refreshRes = await fetch("http://localhost:5001/api/users/auth/refresh", {
      method: "POST",
      credentials: "include"
    });

    if(refreshRes.ok) {
      res = await fetch(url, options);
    } else{
      throw new Error("Session expired. Please log in again");
    }
  }

  return res.json();
}


const EnergyPage = ({ theme, setTheme }) => {
  const [user, setUser] = useState(null);
  const [suns, setSuns] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [overall, setOverall] = useState(0);

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


      
  useEffect(() => {
      const fetchStats = async () => {
        try {
          const data = await authFetch("http://localhost:5001/api/stats", {
            credentials: "include"
          });
        
          setSuns(data.suns || 0);
          setEnergy(data.energy || 0);
      
          const hours = Math.round((data.overall / 3600) * 100) / 100;
      
          setOverall(hours);
        } catch (error) {
          console.error("Failed to fetch stats:", error);
        }
      };
        
      fetchStats();
    }, []);


  return (
    <div>
      <Navbar theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
      <Stat suns={suns} energy={energy} overall={overall} /> 
      <ConversionComponent maxEnergy={energy} suns={suns} setEnergy={setEnergy} setSuns={setSuns} />
    </div>
  )
}

export default EnergyPage
