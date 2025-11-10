const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../midleware/authMidleware");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

const router = express.Router();

// ----------------- Cloudinary Config -----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ----------------- Multer Setup -----------------
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ----------------- ROUTES -----------------

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
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ CREATE new product with Cloudinary upload
router.post("/", protect, admin, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Unauthorized - user not found" });

    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      uploadedImages.push({ url: result.secure_url, altText: file.originalname });
      fs.unlinkSync(file.path); // delete local file
    }

    const productData = {
      ...req.body,
      user: req.user._id,
      images: uploadedImages,
      sizes: req.body.sizes
        ? Array.isArray(req.body.sizes)
          ? req.body.sizes
          : req.body.sizes.split(",").map((v) => v.trim())
        : [],
      colors: req.body.colors
        ? Array.isArray(req.body.colors)
          ? req.body.colors
          : req.body.colors.split(",").map((v) => v.trim())
        : [],
    };

    if (!productData.name || !productData.description || !productData.price)
      return res.status(400).json({ message: "Missing required product fields" });

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// ✅ UPDATE product - Admin only (supports optional new image upload)
router.put("/:id", protect, admin, upload.array("images", 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          transformation: [{ width: 800, height: 800, crop: "limit" }],
        });
        newImages.push({ url: result.secure_url, altText: file.originalname });
        fs.unlinkSync(file.path);
      }
      product.images = [...product.images, ...newImages]; // append new images
    }

    // Update other fields
    const fields = [
      "name",
      "description",
      "price",
      "category",
      "brand",
      "materials",
      "gender",
      "countInStock",
      "isFeatured",
      "isPublished",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    // Update sizes and colors if provided
    if (req.body.sizes) {
      product.sizes = Array.isArray(req.body.sizes)
        ? req.body.sizes
        : req.body.sizes.split(",").map((v) => v.trim());
    }
    if (req.body.colors) {
      product.colors = Array.isArray(req.body.colors)
        ? req.body.colors
        : req.body.colors.split(",").map((v) => v.trim());
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// ✅ DELETE product - Admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;