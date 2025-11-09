const express = require('express');
const Order = require('../models/order');
const { protect } = require('../midleware/authMidleware');
const router = express.Router();



//route  get api/orders/myorders
//get logged in user's orders
//access private

router.get("/myorders", protect, async (req, res) => {
  try {
    console.log("🔍 myorders route hit - User:", req.user._id);
    
    const orders = await Order.find({ 
      user: req.user._id
      // REMOVE isPaid filter for testing
    })
    .sort({ createdAt: -1 })
    .populate('orderItems.productId', 'name image price');

    console.log("✅ Orders found:", orders.length);
    console.log("📦 Order samples:", orders.slice(0, 2).map(o => ({
      id: o._id,
      itemsCount: o.orderItems?.length,
      isPaid: o.isPaid,
      status: o.status
    })));
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error in myorders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//route get api/orders/:id
//desc get order by id
//access private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}); 

module.exports = router;