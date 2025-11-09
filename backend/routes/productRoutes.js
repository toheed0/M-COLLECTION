const express = require("express");
const Product = require("../models/product");
const { protect, admin } = require("../midleware/authMidleware");

const router = express.Router();

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

// ✅ Similar Products (🟢 Move this ABOVE /:id)
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

    if (collections && collections.toLowerCase() !== "all") query.collections = { $regex: collections, $options: "i" };

if (category && category.toLowerCase() !== "all") {
  // ignore exact match, use partial and case-insensitive
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

    console.log("🟢 Query received:", query);
    const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
    console.log("🟢 Products found:", products.length);

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

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, {
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
    });

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
