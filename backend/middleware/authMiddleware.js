import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ include .js

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Check if this is a mock token
    if (token.startsWith("mock_admin_token")) {
      // Create a mock admin user object for database access with valid ObjectId
      req.user = {
        _id: "507f1f77bcf86cd799439011", // Valid 24-character ObjectId for mock admin
        name: "Admin User",
        email: "admin@elderlycare.com",
        role: "admin",
        MobileNumber: "1234567890"
      };
      return next();
    }
    
    if (token.startsWith("mock_customer_token")) {
      // Create a mock customer user object for database access with valid ObjectId
      req.user = {
        _id: "507f1f77bcf86cd799439012", // Valid 24-character ObjectId for mock customer
        name: "John Doe",
        email: "customer@elderlycare.com",
        role: "customer",
        MobileNumber: "9876543210"
      };
      return next();
    }
    
    if (token.startsWith("mock_assistant_token")) {
      // Create a mock assistant user object for database access with valid ObjectId
      req.user = {
        _id: "507f1f77bcf86cd799439013", // Valid 24-character ObjectId for mock assistant
        name: "Jane Smith",
        email: "assistant@elderlycare.com",
        role: "assistant",
        MobileNumber: "5555555555"
      };
      return next();
    }

    // Regular JWT token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
