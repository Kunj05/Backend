import  { useEffect, useRef } from 'react';
import crypto from 'crypto-js';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RenderRazorpay = ({ orderId, keyId, keySecret, amount, currency }) => {
  const paymentId = useRef(null);
  const navigate = useNavigate(); 

  const loadScript = (src) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const displayRazorpay = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      console.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: keyId,
      amount,
      currency,
      name: 'Your Company Name',
      order_id: orderId,
      handler: async (response) => {
        // Verify payment
        const signature = response.razorpay_signature;
        const isValidSignature = crypto.HmacSHA256(`${orderId}|${response.razorpay_payment_id}`, keySecret).toString() === signature;

        if (isValidSignature) {
          // Payment was successful
          await handlePayment('succeeded', {
            orderId,
            paymentId: response.razorpay_payment_id,
            signature,
          });
        } else {
          // Payment verification failed
          await handlePayment('failed', {
            orderId,
            paymentId: response.razorpay_payment_id,
          });
        }
      },
      modal: {
        ondismiss: () => {
          handlePayment('Cancelled');
        },
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };


  const handlePayment = async (status, orderDetails = {}) => {
    const response = await Axios.post('http://localhost:8000/api/v1/payment', {
        status,
        orderDetails,
      });
      console.log('Payment response:', response.data);
  
    if (status === 'succeeded') {
      // Redirect to the home page after successful payment
      navigate('/'); // Use navigate to go back to home
    }
  };

  useEffect(() => {
    displayRazorpay();
  }, []);

  return null;
};

export default RenderRazorpay;
