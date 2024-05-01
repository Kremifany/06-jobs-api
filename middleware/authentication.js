const User = require('../models/User')
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  //   try {
  //     req.user = jwt.verify(token, process.env.JWT_SECRET);

  //     next();
  //   } catch (error) {
  //     throw new UnauthenticatedError("Not authorized");
  //   }
  // };
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
    // Extract token from Authorization header
    const token = authHeader.split(" ")?.[1];
    
  try {
    const payload  = jwt.verify(token, process.env.JWT_SECRET);
    // Verify token and check expiration
    
    // const expirationTime = decoded.exp; // Get expiration time in seconds
    // const now = Math.floor(Date.now() / 1000); // Get current Unix timestamp in seconds
    // if (now > expirationTime) {
    //   throw new UnauthenticatedError("Token expired");
    // }
    
    
    // Token is valid, attach user information and proceed
    req.user = {userId:payload.userId, name:payload.name};
    next();
  } catch (error) {
    // Handle invalid token (e.g., expired or malformed)
    // console.error("Invalid token:", error.message);
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
