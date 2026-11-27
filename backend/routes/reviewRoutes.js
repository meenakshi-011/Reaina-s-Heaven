import express from "express";
import jwt from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import Review from "../models/review.js";
import User from "../models/user.js";

const router = express.Router();

// ── GET ALL REVIEWS (Real-time customer reviews only) ──
router.get("/", async (req, res) => {
  try {
    const { section, limit = 50 } = req.query;
    const filter = {};
    if (section && section !== "all") {
      filter.section = section;
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});


// ── POST A NEW REVIEW (Authenticated or Verified Guest) ──
router.post("/", async (req, res) => {
  try {
    const { userName, userCity, productName, section, rating, comment, orderId } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Review comment cannot be empty." });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars." });
    }

    // Optional user attachment if bearer token present
    let userId = null;
    let verifiedName = userName || "Sanctuary Guest";
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || "reainas_heaven_secret_key_2026");
        userId = decoded.id;
        const dbUser = await User.findById(decoded.id).select("name");
        if (dbUser && dbUser.name) {
          verifiedName = dbUser.name;
        }
      } catch (authErr) {
        // Continue as verified guest with provided name
      }
    }

    const newReview = new Review({
      user: userId,
      userName: verifiedName.trim(),
      userCity: (userCity || "Jabalpur").trim(),
      productName: (productName || "Reaina's Haven Experience").trim(),
      section: section || "general",
      rating: ratingNum,
      comment: comment.trim(),
      orderId: orderId || "",
      isVerifiedBuyer: true,
    });

    const savedReview = await newReview.save();

    // ⚡ REAL-TIME BROADCAST VIA SOCKET.IO
    if (req.io) {
      console.log(`🔌 Real-time review broadcast: "${savedReview.comment.slice(0, 30)}..." by ${savedReview.userName}`);
      req.io.emit("newReview", savedReview);
    }

    res.status(201).json(savedReview);
  } catch (err) {
    console.error("Error creating review:", err.message);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

export default router;
