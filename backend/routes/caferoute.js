import express from "express";
import Cafe from "../models/cafe.js";
import { isLoggedIn } from "../middlewares/authmiddleware.js";

const router = express.Router();

// @desc    Fetch all cafe menu items
// @route   GET /api/cafe
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await Cafe.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Cafe fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch cafe menu" });
  }
});

// @desc    Fetch single cafe item by ID
// @route   GET /api/cafe/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await Cafe.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("Cafe item fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch cafe item" });
  }
});

// @desc    Add new cafe item
// @route   POST /api/cafe
// @access  Private/Admin
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const newItem = new Cafe(req.body);
    const savedItem = await newItem.save();
    
    if (req.io) {
      req.io.emit("cafeItemAdded", savedItem);
    }

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update cafe item
// @route   PUT /api/cafe/:id
// @access  Private/Admin
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const updatedItem = await Cafe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    if (req.io) {
      req.io.emit("cafeItemUpdated", updatedItem);
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete cafe item
// @route   DELETE /api/cafe/:id
// @access  Private/Admin
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const item = await Cafe.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (req.io) {
      req.io.emit("cafeItemDeleted", req.params.id);
    }

    res.json({ message: "Cafe item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
