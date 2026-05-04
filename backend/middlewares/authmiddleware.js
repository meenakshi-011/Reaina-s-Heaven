// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch user data from database excluding password
      req.user = await User.findById(decoded.id).select("-password");
      
      // 🚨 TEMPORARY OVERRIDE: Ensure this specific user is always Admin for debugging
      if (req.user && req.user.email === 'meenakship928@gmail.com') {
        req.user.role = 'SUPER_ADMIN';
      }
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token" });
  }
};
