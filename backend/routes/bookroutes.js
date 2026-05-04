import express from "express";
import Book from "../models/books.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const router = express.Router();

// Fetch all books with connection check
router.get("/", async (req, res) => {
  try {
    // If connecting, wait up to 10 seconds for connection to be ready
    let attempts = 0;
    while (mongoose.connection.readyState === 2 && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (mongoose.connection.readyState === 1) {
      console.log("Fetching books from MongoDB...");
      const books = await Book.find({});
      console.log(`Found ${books.length} books in MongoDB`);
      if (books.length > 0) return res.json(books);
    }

    // Fallback: Read from local db.json
    console.log("Serving books from local fallback...");
    const dataPath = path.join(process.cwd(), "db.json");
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    res.json(jsonData.books || []);
  } catch (error) {
    console.error("Book fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

export default router;
