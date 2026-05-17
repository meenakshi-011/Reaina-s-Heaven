import mongoose from "mongoose";

const cafeItemSchema = new mongoose.Schema(
  {
    cloudKitchenName: {
      type: String,
      default: "REAINA'S HEAVEN"
    },

    location: {
      type: String,
      default: "Green City, Jabalpur"
    },

    // 🔥 MAIN CATEGORY (UI FILTER)
    category: {
      type: String,
      required: true
    },

    // 🔥 SUB CATEGORY (VARIANT TYPE)
    subCategory: {
      type: String,
      required: true
    },

    item_name: {
      type: String,
      required: true
    },

    item_type: {
      type: String,
      enum: ["veg", "non-veg"],
      default: "veg"
    },

    is_healthy: {
      type: Boolean,
      default: false
    },

    // 🔥 FLOUR / BASE FILTER (FOR SEARCH & FILTER UI)
    filter: [
      {
        type: String
      }
    ],

    // 🔥 INGREDIENTS (AI / BILL / RECOMMENDATION ENGINE)
    ingredients: [
      {
        type: String
      }
    ],

    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Spicy"],
      default: "Mild"
    },

    is_customizable: {
      type: Boolean,
      default: true
    },

    imageurl: {
      type: String,
      default: ""
    },

    // 🔥 QUANTITY-BASED PRICING SYSTEM
    quantityOptions: [
      {
        label: String,     // "6 pcs"
        quantity: Number,  // 6
        price: Number      // 149
      }
    ],
    includes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("CafeItem", cafeItemSchema, "cafe");