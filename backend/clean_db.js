import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config({ override: true });

async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    
    for (let p of products) {
      const data = p._doc || p;
      const rawPrice = data.price || data["price url"] || 0;
      let parsedPrice = 0;
      
      if (typeof rawPrice === 'number') {
        parsedPrice = rawPrice;
      } else if (typeof rawPrice === 'string') {
        const match = rawPrice.match(/(\d+(\.\d+)?)/);
        parsedPrice = match ? parseFloat(match[0]) : 0;
      }

      const cleanData = {
        name: data.name,
        category: data.category,
        mood: data.mood,
        price: parsedPrice || 499,
        image: data.imageurl || data["image url"] || data.imageUrl || data.ImageURL || data.image_url || data.image || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&auto=format&fit=crop",
        description: data.description || "Beautifully curated item for your cozy lifestyle.",
        tag: data.avg_rating > 4.5 ? "Bestseller" : (data.tag || null),
        tagColor: data.avg_rating > 4.5 ? "bg-amber-100 text-amber-700" : (data.tagColor || "")
      };

      // Replace the entire document with clean data
      await Product.findByIdAndUpdate(p._id, cleanData, { overwrite: true, new: true });
    }

    console.log("Database cleaned and normalized! ✨");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanDatabase();
