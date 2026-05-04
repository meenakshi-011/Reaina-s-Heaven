import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Product from "./models/product.js";
import CafeItem from "./models/cafe.js";
import Book from "./models/books.js";
import Feature from "./models/feature.js";
import Experience from "./models/experience.js";

dotenv.config();

async function seedAll() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for full seeding.");

    const dbDataPath = path.join(process.cwd(), "db.json");
    const dbData = JSON.parse(fs.readFileSync(dbDataPath, "utf-8"));

    // Seed Products
    if (dbData.products && dbData.products.length > 0) {
      await Product.deleteMany({});
      const formattedProducts = dbData.products.map(p => ({
        ...p,
        _id: undefined // Let MongoDB generate new IDs
      }));
      await Product.insertMany(formattedProducts);
      console.log(`Seeded ${dbData.products.length} products.`);
    }

    // Seed Cafe
    if (dbData.cafe && dbData.cafe.length > 0) {
      await CafeItem.deleteMany({});
      const formattedCafe = dbData.cafe.map(c => ({
        ...c,
        _id: undefined
      }));
      await CafeItem.insertMany(formattedCafe);
      console.log(`Seeded ${dbData.cafe.length} cafe items.`);
    }

    // Seed Books
    if (dbData.books && dbData.books.length > 0) {
      await Book.deleteMany({});
      const formattedBooks = dbData.books.map(b => ({
        ...b,
        _id: undefined
      }));
      await Book.insertMany(formattedBooks);
      console.log(`Seeded ${dbData.books.length} books.`);
    }

    // Seed Features
    if (dbData.features && dbData.features.length > 0) {
      await Feature.deleteMany({});
      await Feature.insertMany(dbData.features);
      console.log(`Seeded ${dbData.features.length} features.`);
    }

    // Seed Experiences
    if (dbData.experiences && dbData.experiences.length > 0) {
      await Experience.deleteMany({});
      const formattedExp = dbData.experiences.map(e => ({
        ...e,
        _id: undefined
      }));
      await Experience.insertMany(formattedExp);
      console.log(`Seeded ${dbData.experiences.length} experiences.`);
    }

    console.log("Full database seeding completed! 🚀");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedAll();
