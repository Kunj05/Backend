const express = require("express");
const route = express.Router();
const { createOrder,verifyPayment,sendPaymentSuccessEmail}=require("../controllers/paymentController")

route.post("/createorder", createOrder);
route.post("/verifypayment", verifyPayment);
route.post("/paymnetsuccess", sendPaymentSuccessEmail);

module.exports = route;