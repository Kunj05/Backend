import React, { useState } from 'react';
import './Item.css'; 
import RenderRazorpay from './RenderRazorpay'; 

const Item = ({ item }) => {
  const [orderId, setOrderId] = useState(null);
  const [isRazorpayVisible, setIsRazorpayVisible] = useState(false);

  const handleBuyNow = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/createorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: item.price * 100, currency: 'INR' }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the HTML response
        console.error('Error response:', errorMessage);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const orderData = await response.json();
      if (orderData.id) {
        setOrderId(orderData.id);
        setIsRazorpayVisible(true);
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="item-card">
      <img src={`https://via.placeholder.com/150`} alt={item.name} className="item-image" />
      <h2 className="item-name">{item.name}</h2>
      <p className="item-description">{item.description}</p>
      <p className="item-price">Price: ₹{item.price}</p>
      <button className="buy-button" onClick={handleBuyNow}>Buy Now</button>

      {isRazorpayVisible && orderId && (
        <RenderRazorpay 
          orderId={orderId} 
          keyId={process.env.RECAT_RAZOPAY_KEY}
          keySecret={process.env.RECAT_RAZOPAY_SECRET}
          amount={item.price * 100} 
          currency="INR" 
        />
      )}
    </div>
  );
};

export default Item;
