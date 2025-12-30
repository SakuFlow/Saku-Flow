import React, { useState } from "react";

const Card = () => {

  const initialItems = [
    { id: 1, name: "Golden Sun", description: "Increases sun production by 10%", price: 10, available: true, multiplier: 1.2 },
    { id: 2, name: "Energy Drink", description: "Boosts energy temporarily", price: 50, available: false, multiplier: 1.3 },
    { id: 3, name: "Study Book", description: "Increases study efficiency", price: 100, available: false, multiplier: 1.4 },
    { id: 4, name: "Magic Plant", description: "Special item coming soon", price: 200, available: false, multiplier: 1.5 },
    { id: 5, name: "Solar Panel", description: "Special item coming soon", price: 1000, available: true, multiplier: 1.6 },
  ];

  const [shopItems, setShopItems] = useState(initialItems);

  // Handle buying an item
  const handleBuy = (id) => {
    setShopItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newPrice = Math.ceil(item.price * item.multiplier); 
          return { ...item, price: newPrice };
        }
        return item;
      })
    );
  };

  return (
    <div className="p-6 w-full md:w-4/5 mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className={`card w-72 bg-base-200 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 ${
              !item.available ? "opacity-50" : ""
            }`}
          >
            <figure className="mb-4 h-32 bg-base-300 flex items-center justify-center rounded-md text-gray-500">
              {item.available ? item.name[0] : "?"}
            </figure>
            <div className="card-body p-0">
              <h2 className="card-title text-lg font-bold">{item.available ? item.name : "???"}</h2>
              <p className="text-sm mb-2">{item.available ? item.description : "???"}</p>
              <div className="card-actions justify-between items-center mt-2">
                <span className="font-semibold">{item.available ? `${item.price} ☀` : "---"}</span>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!item.available}
                  onClick={() => handleBuy(item.id)}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
