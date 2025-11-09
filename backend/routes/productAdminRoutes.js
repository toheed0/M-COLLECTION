const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../midleware/authMidleware");

const router = express.Router();

// ✅ GET all products - Admin only
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET single product by ID - Admin only
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ CREATE new product - Admin only
router.post("/", protect, admin, async (req, res) => {
  try {
    // 🧩 Make sure user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    // 🧩 Ensure required fields are valid arrays
    const productData = {
      ...req.body,
      user: req.user._id,
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : (req.body.sizes || "").split(",").map((v) => v.trim()).filter(Boolean),
      colors: Array.isArray(req.body.colors)
        ? req.body.colors
        : (req.body.colors || "").split(",").map((v) => v.trim()).filter(Boolean),
      images: Array.isArray(req.body.images)
        ? req.body.images
        : [],
    };

    // 🧩 Validation before saving
    if (!productData.name || !productData.description || !productData.price) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    if (!productData.sizes.length)
      return res.status(400).json({ message: "At least one size is required" });

    if (!productData.colors.length)
      return res.status(400).json({ message: "At least one color is required" });

    if (!productData.images.length)
      return res.status(400).json({ message: "At least one image is required" });

    // ✅ Create product
    const product = new Product(productData);
    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// ✅ UPDATE product - Admin only
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ DELETE product - Admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
