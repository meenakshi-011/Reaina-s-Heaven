import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    cafeName: {
      type: String,
      default: "REAINA'S HEAVEN"
    },

    category: {
      type: String,
      required: true
    },

    productType: {
      type: String, 
      enum: ["Bouquet", "Hamper"],
      required: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    description: {
      type: String
    },

    imageUrl: {
      type: String,
      required: true
    },
    
    stock: {
      type: Number,
      required: true,
      default: 10
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);