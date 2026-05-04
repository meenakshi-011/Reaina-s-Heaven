import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: String,
  date: String,
  price: String,
  image: String,
  desc: String,
  spots: String
}, { timestamps: true });

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
