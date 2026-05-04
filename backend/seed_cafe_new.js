import mongoose from "mongoose";
import dotenv from "dotenv";
import CafeItem from "./models/cafe.js";

dotenv.config();

const newCafeData = [
  {
    cloudKitchenName: "REAINA'S HEAVEN",
    location: "Green City, Jabalpur",
    category: "Momos",
    subCategory: "Steam",
    item_name: "Veg Steam Momos",
    item_type: "veg",
    is_healthy: true,
    filter: ["Whole Wheat"],
    ingredients: ["Cabbage", "Carrot", "Paneer"],
    spiceLevel: "Mild",
    imageurl: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&auto=format&fit=crop",
    quantityOptions: [
      { label: "6 pcs", quantity: 6, price: 149 },
      { label: "12 pcs", quantity: 12, price: 279 }
    ]
  },
  {
    cloudKitchenName: "REAINA'S HEAVEN",
    location: "Green City, Jabalpur",
    category: "Momos",
    subCategory: "Fried",
    item_name: "Paneer Fried Momos",
    item_type: "veg",
    is_healthy: false,
    filter: ["Maida"],
    ingredients: ["Paneer", "Onion", "Capsicum"],
    spiceLevel: "Medium",
    imageurl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop",
    quantityOptions: [
      { label: "6 pcs", quantity: 6, price: 179 },
      { label: "12 pcs", quantity: 12, price: 329 }
    ]
  },
  {
    cloudKitchenName: "REAINA'S HEAVEN",
    location: "Green City, Jabalpur",
    category: "Beverages",
    subCategory: "Cold Coffee",
    item_name: "Classic Cold Coffee",
    item_type: "veg",
    is_healthy: false,
    filter: ["Dairy"],
    ingredients: ["Coffee", "Milk", "Ice Cream"],
    spiceLevel: "Mild",
    imageurl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop",
    quantityOptions: [
      { label: "Regular", quantity: 1, price: 189 },
      { label: "Large", quantity: 1, price: 249 }
    ]
  },
  {
    cloudKitchenName: "REAINA'S HEAVEN",
    location: "Green City, Jabalpur",
    category: "Breakfast",
    subCategory: "Poha",
    item_name: "Indori Poha",
    item_type: "veg",
    is_healthy: true,
    filter: ["Rice Flakes"],
    ingredients: ["Poha", "Peanuts", "Sev"],
    spiceLevel: "Medium",
    imageurl: "https://images.unsplash.com/photo-1626074246313-1288e43d5f8e?w=600&auto=format&fit=crop",
    quantityOptions: [
      { label: "Full Plate", quantity: 1, price: 129 }
    ]
  }
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI || "";
    console.log("Connecting to:", uri);
    await mongoose.connect(uri);
    
    // The model is exported as 'CafeItem' and uses collection 'cafe'
    await CafeItem.deleteMany({});
    console.log("Cleared old data");
    
    const result = await CafeItem.insertMany(newCafeData);
    console.log(`Successfully seeded ${result.length} items into MongoDB!`);
    
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
