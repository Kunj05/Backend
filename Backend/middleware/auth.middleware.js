const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
require('dotenv').config();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            message: 'No token, authorization denied.' 
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({ 
            message: 'Token is expired.' 
        });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ 
            message: 'User not found with token.' 
        });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
            message: 'Token is not valid.' 
        });
    }
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
            message: 'Token is expired.' 
        });
    }
    return res.status(500).json({ 
        message: 'Internal Server Error.', 
        error: error.message 
    });
  }
};

module.exports = verifyToken;
