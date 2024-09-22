import React from 'react';
import Item from './Item';
import './Item.css'; 

const items = [
  {
    id: 1,
    name: "Eco-Friendly Water Bottle",
    price: 2400,
    description: "Stay hydrated with this reusable, BPA-free water bottle. Perfect for on-the-go!"
  },
  {
    id: 2,
    name: "Wireless Bluetooth Headphones",
    price: 890,
    description: "Experience high-quality sound with these comfortable, noise-canceling headphones."
  },
  {
    id: 3,
    name: "Smartwatch with Fitness Tracker",
    price: 199.99,
    description: "Track your fitness goals and receive notifications right on your wrist with this stylish smartwatch."
  },
  {
    id: 4,
    name: "Organic Cotton Tote Bag",
    price: 15.99,
    description: "A durable and stylish tote bag made from 100% organic cotton. Perfect for shopping or daily use!"
  },
];


const Home = () => {
  return (
    <div className="home-container">
      {items.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Home;
