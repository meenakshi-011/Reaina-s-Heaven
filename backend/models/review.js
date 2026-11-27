import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userCity: {
      type: String,
      default: "Jabalpur",
      trim: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    orderId: {
      type: String,
      default: "",
    },
    productName: {
      type: String,
      default: "Reaina's Haven Experience",
      trim: true,
    },
    section: {
      type: String,
      enum: ["products", "cafe", "experiences", "tiffin", "general"],
      default: "general",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
