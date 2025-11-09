const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ✅ Protect routes (authentication)
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🟡 Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ JWT decoded successfully:", decoded);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.error("❌ JWT expired:", err.message);
        return res.status(401).json({ message: "Token expired, please login again" });
      }
      console.error("❌ JWT verify error:", err.message);
      return res.status(401).json({ message: "Token invalid" });
    }

    // ✅ Adjust for correct token structure
    // Sometimes token stores "id" or "_id" directly (not inside decoded.user)
    const userId = decoded.id || decoded._id || decoded?.user?.id;

    if (!userId) {
      console.error("❌ Invalid token structure:", decoded);
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

// ✅ Admin check middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, admin access required" });
  }
};

module.exports = { protect, admin };
