// ============================================================
// AI GENERATE ROUTE - Apni existing productRoutes.js mein
// router.post("/") se PEHLE yeh route add karein
// ============================================================
//
// Required packages install karein:
//   npm install @anthropic-ai/sdk multer
//
// .env mein add karein:
//   ANTHROPIC_API_KEY=your_api_key_here
//
// ============================================================

const express = require("express");
const multer = require("multer");
const Groq = require("groq-sdk");
const Product = require("../models/product");
const { protect, admin } = require("../midleware/authMidleware");

const router = express.Router();

// Multer — sirf memory mein rakhein (disk pe save nahi)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Sirf image files allowed hain"), false);
    }
  },
});

// Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ POST /api/products/ai-generate
// Image se product title + description generate karta hai
router.post(
  "/ai-generate",
  protect,
  admin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({
          message: "GROQ_API_KEY missing (set it in backend environment variables)",
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Koi image nahi mili" });
      }

      // Image ko base64 mein convert karein
      const base64Image = req.file.buffer.toString("base64");
      const mediaType = req.file.mimetype; // e.g. "image/jpeg"

      const imageDataUrl = `data:${mediaType};base64,${base64Image}`;

      // Groq Vision (OpenAI-compatible chat format)
      const completion = await client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.2,
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Yeh ek ecommerce product ki image hai. Is image ko dekh kar:
1. Ek catchy aur SEO-friendly product NAME likho (max 60 characters)
2. Ek compelling product DESCRIPTION likho (2-3 sentences, max 200 characters)

Sirf JSON format mein jawab do, koi extra text nahi:
{
  "name": "Product ka naam yahan",
  "description": "Product ki description yahan"
}`,
              },
              {
                type: "image_url",
                image_url: { url: imageDataUrl },
              },
            ],
          },
        ],
      });

      const rawText = (completion.choices?.[0]?.message?.content || "").trim();
      if (!rawText) {
        return res.status(500).json({ message: "AI se empty response mila" });
      }

      // JSON extract karein (agar Claude ne extra text diya toh bhi kaam kare)
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res
          .status(500)
          .json({ message: "AI se valid response nahi mila" });
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.name || !parsed.description) {
        return res
          .status(500)
          .json({ message: "AI response mein name ya description nahi" });
      }

      return res.status(200).json({
        name: parsed.name,
        description: parsed.description,
      });
    } catch (error) {
      console.error("❌ AI Generate Error:", error);

      const status = error?.status || error?.response?.status;
      if (status === 401) {
        return res.status(401).json({ message: "Groq API unauthorized (check GROQ_API_KEY)" });
      }
      if (status === 429) {
        return res.status(429).json({ message: "AI rate limit (try again later)" });
      }

      return res.status(500).json({
        message: error?.message || "AI generation fail hua",
      });
    }
  }
);

// ============================================================
// BAAKI SAARE ROUTES NEECHE COPY KAREIN (unchanged)
// ============================================================

// ✅ POST - Create Product
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      materials,
      gender,
      images,
      isFeatured,
      isPublished,
      tag,
      dimenisions,
      weigth,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      materials,
      gender,
      images,
      isFeatured,
      isPublished,
      tag,
      dimenisions,
      weigth,
      sku,
      user: req.user.id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Best Selling
router.get("/best-selling", async (req, res) => {
  try {
    const bestSellingProducts = await Product.find({}).sort({ sales: -1 });
    if (!bestSellingProducts) {
      return res.status(404).json({ message: "No best selling products found" });
    }
    res.json(bestSellingProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ New Arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find({}).sort({ createdAt: -1 }).limit(10);
    if (!newArrivals) {
      return res.status(404).json({ message: "No new arrivals found" });
    }
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Similar Products
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET All Products (with filters)
router.get("/", async (req, res) => {
  try {
    const {
      collections,
      sortBy,
      search,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      gender,
      materials,
      brand,
      limit,
    } = req.query;

    let query = {};

    if (collections && collections.toLowerCase() !== "all")
      query.collections = { $regex: collections, $options: "i" };

    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: category.replace("-", " "), $options: "i" };
    }
    if (materials) query.materials = { $in: materials.split(",") };
    if (brand) query.brand = { $in: brand.split(",") };
    if (size) query.sizes = { $in: size.split(",") };
    if (color) query.colors = { $in: color.split(",") };
    if (gender) query.gender = new RegExp(`^${gender}$`, "i");

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error("❌ Error in products route:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get Single Product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ PUT Update Product
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE Product
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ Product removed successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;