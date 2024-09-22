const razorpayInstance = require("../config/razopay.config");
const mailSender = require("../utils/nodemailer");
const paymentSuccessEmail = require("../utils/paymentsuccessEmail");
const User=require("../models/User.model")
require("dotenv").config();
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, 
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
      payment_capture: true,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json(order);
  } catch (err) {
    console.error(err); 
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(200).json({
        success: false,
        message: "Payment Failed",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ 
        success: true,
        message: "Payment verified successfully" 
      });
    } else {
      res.status(400).json({ 
        error: "Invalid payment signature" 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error Payment Failed",
      Error: err,
     });
  }
};

// Send Payment Success Email
const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details",
    });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    return res.json(500).json({
      success: false,
      message: "Could not send email",
      Error: error,
    });
  }
};
module.exports = {
  createOrder,
  verifyPayment,
  sendPaymentSuccessEmail,
};
