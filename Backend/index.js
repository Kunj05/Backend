const express = require("express");
const passport = require("passport");
const Razorpay = require('razorpay');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoute = require("./routes/auth.route");
const paymentRoute=require("./routes/payment.route")
const cors = require('cors');
const connectDB =require('./config/db')
require('dotenv').config();
require('./config/passport');

// Global MiddleWare
const app = express();
const port = process.env.PORT || 8000;

// Session middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

  
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
connectDB();
  
// Authentication Route Middleware
app.use("/api/v1", authRoute);
app.use("/api/v1", paymentRoute);

app.get("/", (req, res) => {
    res.send(`My Node.JS APP`);
});
  
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
});