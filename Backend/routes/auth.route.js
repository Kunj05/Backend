const express = require("express");
const passport = require("passport");
const route = express.Router();
const jwt = require('jsonwebtoken');

const {
    login,
    signup,
    OauthFailure,
  } = require("../controllers/authController");

const { verifyToken } = require("../middleware/auth.middleware");

// authetication route
route.get("/auth/google",passport.authenticate("google", {
      scope: ["email", "profile"],
    })
);

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Call back route
route.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/login" }),
  (req, res) => {
      if (!req.user) {
          return res.status(400).json({ error: "Authentication failed" });
      }
      const token = generateToken(req.user); 
      return res.status(200).json({ user: req.user, token }); 
  }
);

  

route.get("/auth/failure", OauthFailure);
route.post("/signup", signup);
route.post("/login", login);

module.exports = route;