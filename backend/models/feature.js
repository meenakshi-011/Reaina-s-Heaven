import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  title: String,
  label: String,
  desc: String,
  img: String,
  link: String
}, { timestamps: true });

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;
