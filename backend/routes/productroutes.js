import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// Fetch all products with fallback to local JSON
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});
// Fetch single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", async (req, res) => {
  try {
    const { name, price, description, imageUrl, category, productType } = req.body;
    
    const product = new Product({
      name,
      price,
      description,
      imageUrl,
      category,
      productType
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ message: `Failed to create product: ${error.message}` });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, imageUrl, category, productType, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.productType = productType || product.productType;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
