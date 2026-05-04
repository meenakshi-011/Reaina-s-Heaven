import express from "express";
import Feature from "../models/feature.js";
import Experience from "../models/experience.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const router = express.Router();

// Fetch all features with fallback
router.get("/features", async (req, res) => {
  try {
    let attempts = 0;
    while (mongoose.connection.readyState === 2 && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (mongoose.connection.readyState === 1) {
      const features = await Feature.find({});
      if (features.length > 0) return res.json(features);
    }

    // Fallback
    console.log("Serving features from fallback...");
    const dataPath = path.join(process.cwd(), "db.json");
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    res.json(jsonData.features || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching features" });
  }
});

// Fetch all experiences with fallback
router.get("/experiences", async (req, res) => {
  try {
    let attempts = 0;
    while (mongoose.connection.readyState === 2 && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (mongoose.connection.readyState === 1) {
      const experiences = await Experience.find({});
      if (experiences.length > 0) return res.json(experiences);
    }

    // Fallback
    console.log("Serving experiences from fallback...");
    const dataPath = path.join(process.cwd(), "db.json");
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    res.json(jsonData.experiences || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experiences" });
  }
});

export default router;
