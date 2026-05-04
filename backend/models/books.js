import mongoose from "mongoose";

const editionSchema = new mongoose.Schema({
  format: String,
  isbn: String,
  pages: Number,
  publisher: String,
  publication_date: String,
  price: Number,
  currency: { type: String, default: "INR" },
  language: { type: String, default: "English" },
  stock_status: String,
  file_format: String,
  file_size_mb: Number,
  drm_protected: Boolean
});

const bookSchema = new mongoose.Schema({
  book_id: { type: String, required: true, unique: true },
  book_name: { type: String, required: true },
  author: { type: String, required: true },
  release_year: Number,
  genre: [String],
  synopsis: String,
  rating: Number,
  num_ratings: Number,
  editions: [editionSchema]
}, { timestamps: true, collection: "books" });

const Book = mongoose.model("Book", bookSchema);
export default Book;
