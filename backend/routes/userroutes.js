import express from "express";
import User from "../models/user.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Apply isLoggedIn middleware to all these routes
router.use(isLoggedIn);

router.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to your secure dashboard", user: req.user });
});

router.get("/cart", (req, res) => {
  res.json({ message: "Secure cart access", user: req.user });
});

router.get("/checkout", (req, res) => {
  res.json({ message: "Secure checkout access", user: req.user });
});

router.get("/orders", (req, res) => {
  res.json({ message: "Secure orders access", user: req.user });
});

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ message: "Secure profile access", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;
      
      const updatedUser = await user.save();
      res.json({
        message: "Profile updated successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/user
// @access  Private/Admin
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

import Activity from "../models/activity.js";

// @desc    Toggle item in wishlist
// @route   POST /api/user/wishlist
router.post("/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId);
      
      // Log Activity
      await Activity.create({
        user: req.user._id,
        type: 'wishlist',
        action: 'Added to Wishlist',
        details: `Item ID: ${productId}`
      });
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    
    if (req.io) {
      req.io.emit("wishlistUpdated", { userId: req.user._id, wishlist: user.wishlist });
      req.io.emit("activityUpdate", { userId: req.user._id });
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user activities
// @route   GET /api/user/activity
router.get("/activity", async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
