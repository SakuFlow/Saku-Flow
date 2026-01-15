import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Card from '../components/Card.jsx';

const ShopPage = ({ theme, setTheme }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include"
        });

        if (!res.ok) {
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
    <div>
      <Navbar theme={theme} setTheme={setTheme} user={user} setUser={setUser} />
      <Card />
    </div>
  );
};

export default ShopPage;
