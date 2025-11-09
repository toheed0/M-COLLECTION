const express = require('express');
const Checkout = require('../models/checkout');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
const { protect } = require('../midleware/authMidleware');
const router = express.Router();

// route POST api/checkout
// desc create a new checkout session
router.post('/', protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: 'No items to checkout' });
    }

    try {
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: 'Pending',
            isPaid: false,
            isFinalized: false
        });
        console.log(`✅ Checkout created for user: ${req.user._id}, ID: ${newCheckout._id}`);
        return res.status(201).json(newCheckout);

    } catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// route GET /api/checkout/user/checkouts
// desc get all checkouts for logged-in user (both paid and unpaid)
router.get("/user/checkouts", protect, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ 
      user: req.user._id
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${checkouts.length} checkouts for user: ${req.user._id}`);
    res.status(200).json(checkouts);
  } catch (error) {
    console.error("Error fetching user checkouts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// route GET /api/checkout/debug/user-checkouts
// desc debug route to see all user checkouts
router.get("/debug/user-checkouts", protect, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    console.log("🔍 Debug - User Checkouts:", {
      userId: req.user._id,
      totalCheckouts: checkouts.length,
      paidCheckouts: checkouts.filter(c => c.isPaid).length,
      finalizedCheckouts: checkouts.filter(c => c.isFinalized).length
    });

    res.json({
      userId: req.user._id,
      totalCheckouts: checkouts.length,
      paidCheckouts: checkouts.filter(c => c.isPaid).length,
      finalizedCheckouts: checkouts.filter(c => c.isFinalized).length,
      checkouts: checkouts
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

// route GET /api/checkout/:id
// desc get checkout details by ID
// access Private
router.get('/:id', protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json(checkout);
    } catch (error) {
        console.error("Error fetching checkout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// route PUT /api/checkout/:id/pay
// desc update checkout to mark as paid after successful payment + AUTO CREATE ORDER
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (paymentStatus === "paid") {
            // ✅ Update checkout payment status
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            console.log(`✅ Payment successful for checkout: ${checkout._id}`);

            // ✅ AUTOMATICALLY CREATE ORDER
            try {
                const finalOrder = await Order.create({
                    user: checkout.user,
                    orderItems: checkout.checkoutItems,
                    shippingAddress: checkout.shippingAddress,
                    paymentMethod: checkout.paymentMethod,
                    totalPrice: checkout.totalPrice,
                    isPaid: true,
                    paidAt: checkout.paidAt,
                    isDelivered: false,
                    paymentStatus: "Paid",
                    paymentDetails: checkout.paymentDetails,
                    status: "Processing"
                });

                // ✅ Mark checkout as finalized
                checkout.isFinalized = true;
                checkout.finalizedAt = Date.now();
                await checkout.save();

                // ✅ Clear user's cart
                await Cart.findOneAndDelete({ user: checkout.user });

                console.log(`✅ Order automatically created: ${finalOrder._id}`);

                return res.status(200).json({
                    message: "Payment successful and order created",
                    order: finalOrder,
                    checkout: checkout
                });

            } catch (finalizeError) {
                console.error("❌ Auto-finalize error:", finalizeError);
                return res.status(500).json({ 
                    message: "Payment successful but order creation failed",
                    checkout: checkout
                });
            }
        } else {
            res.status(400).json({ message: "Invalid payment status" });
        }
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// route PUT /api/checkout/:id/mark-paid
// desc manually mark checkout as paid and create order (for testing)
router.put("/:id/mark-paid", protect, async (req, res) => {
    try {
        console.log(`🔄 Marking checkout as paid: ${req.params.id}`);
        
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            console.log("❌ Checkout not found");
            return res.status(404).json({ message: "Checkout not found" });
        }

        console.log("🔍 Checkout found:", {
            id: checkout._id,
            isPaid: checkout.isPaid,
            isFinalized: checkout.isFinalized,
            user: checkout.user
        });

        if (checkout.isPaid) {
            console.log("❌ Checkout already paid");
            return res.status(400).json({ message: "Checkout already paid" });
        }

        // Mark as paid
        checkout.isPaid = true;
        checkout.paymentStatus = "paid";
        checkout.paymentDetails = { 
            method: "manual", 
            status: "success",
            manual: true
        };
        checkout.paidAt = Date.now();

        console.log("✅ Checkout marked as paid, saving...");
        await checkout.save();

        console.log(`✅ Manual payment marked for checkout: ${checkout._id}`);

        // Auto create order
        console.log("🔄 Creating order from checkout...");
        const finalOrder = await Order.create({
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "Paid",
            paymentDetails: checkout.paymentDetails,
            status: "Processing"
        });

        console.log(`✅ Order created: ${finalOrder._id}`);

        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();

        console.log("🔄 Clearing user cart...");
        await Cart.findOneAndDelete({ user: checkout.user });

        console.log(`✅ Order created via manual payment: ${finalOrder._id}`);
        
        res.status(200).json({
            message: "Payment marked as paid and order created successfully",
            order: finalOrder
        });
        
    } catch (error) {
        console.error("❌ Error in mark-paid route:", error);
        console.error("❌ Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
});
// checkoutRoutes.js - ADD THIS SIMPLE ROUTE FIRST
router.put("/:id/mark-paid-simple", protect, async (req, res) => {
    try {
        console.log(`🔄 Simple mark-paid for: ${req.params.id}`);
        
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (checkout.isPaid) {
            return res.status(400).json({ message: "Checkout already paid" });
        }

        // Simple update - just mark as paid
        checkout.isPaid = true;
        checkout.paymentStatus = "paid";
        checkout.paidAt = Date.now();
        
        await checkout.save();

        console.log(`✅ Simple mark-paid successful: ${checkout._id}`);
        
        res.status(200).json({
            message: "Checkout marked as paid successfully",
            checkout: checkout
        });
        
    } catch (error) {
        console.error("❌ Simple mark-paid error:", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
});
// route POST /api/checkout/:id/convert-to-order
// desc convert existing paid checkout to order
router.post("/:id/convert-to-order", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (!checkout.isPaid) {
            return res.status(400).json({ message: "Checkout not paid yet" });
        }

        if (checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout already finalized" });
        }

        const finalOrder = await Order.create({
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "Paid",
            paymentDetails: checkout.paymentDetails,
            status: "Processing"
        });

        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();

        console.log(`✅ Checkout converted to order: ${finalOrder._id}`);
        
        res.status(201).json({
            message: "Checkout successfully converted to order",
            order: finalOrder
        });
        
    } catch (error) {
        console.error("Error converting checkout to order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;