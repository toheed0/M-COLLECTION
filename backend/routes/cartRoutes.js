const express = require("express");
const Product = require("../models/product");
const Cart = require("../models/cart");
const {protect}= require("../midleware/authMidleware");


const router=express.Router();


//helper function to get cart by userId or guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};


//route api/cart
//add a product to the cart for a guest user or logged in user
router.post("/", async (req , res)=>{
    const {productId, quantity, color, size, guestId,userId}= req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const cart = await getCart(userId, guestId);
        if (cart) {
            // If cart exists, update it
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId && item.color === color && item.size === size);
            if (productIndex > -1) {
                // If item exists in cart, update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // If item doesn't exist, add it
                cart.products.push({ productId, name: product.name, image: product.images[0].url, price: product.price, color, size, quantity });
            }
            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // If cart doesn't exist, create a new one
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + Date.now().toString(),
                products: [{ productId, name: product.name, image: product.images[0].url, price: product.price, color, size, quantity }],
                totalPrice: quantity * product.price,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


//route put api/cart
//update cart item quantity
router.put("/", async (req , res)=>{
    const {productId, quantity, color, size, guestId,userId}= req.body;
    try{
        let cart = await getCart(userId, guestId);
        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId && item.color === color && item.size === size);

        if(productIndex > -1){
            // If item exists in cart, update quantity
            if(quantity > 0){
                cart.products[productIndex].quantity = quantity; 
            
            }else{
                // Remove item if quantity is zero or less
                cart.products.splice(productIndex, 1);
            }
            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({ message: "Product not found in cart" });
        }


    }catch(error){
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


//route delete api/cart

router.delete("/", async (req , res)=>{
    const {productId, color, size, guestId,userId}= req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId && item.color === color && item.size === size);
        if (productIndex > -1) {
            // If item exists in cart, remove it
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Error deleting from cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


//route get api/cart
//get cart for a guest user or logged in user

router.get("/", async (req , res)=>{
    const {guestId,userId}= req.query;
    try{
        const cart = await getCart(userId, guestId);
        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }
        return res.status(200).json(cart);
    }catch(error){
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


// route: POST /api/cart/merge
// desc: Merge guest cart into user cart upon login
// access: Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // 🔹 Find guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    // 🔹 If no guest cart, just return user cart (or message)
    if (!guestCart) {
      if (userCart) {
        return res.status(200).json(userCart);
      } else {
        return res.status(200).json({ message: "No carts to merge" });
      }
    }

    // 🔹 If guest cart is empty
    if (guestCart.products.length === 0) {
      return res.status(400).json({ message: "Guest cart is empty" });
    }

    // 🔹 If user already has a cart, merge items
    if (userCart) {
      guestCart.products.forEach((guestItem) => {
        const userItemIndex = userCart.products.findIndex(
          (item) =>
            item.productId.toString() === guestItem.productId.toString() &&
            item.color === guestItem.color &&
            item.size === guestItem.size
        );

        if (userItemIndex > -1) {
          // Item exists → increase quantity
          userCart.products[userItemIndex].quantity += guestItem.quantity;
        } else {
          // Item doesn’t exist → add new
          userCart.products.push(guestItem);
        }
      });

      // 🔹 Recalculate total
      userCart.totalPrice = userCart.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      await userCart.save();

      // 🔹 Remove guest cart after merging
      try {
        await Cart.deleteOne({ guestId }); // ✅ Corrected deletion
      } catch (err) {
        console.error("Error deleting guest cart:", err);
      }

      return res.status(200).json(userCart);
    } else {
      // 🔹 If user has no cart, assign guest cart to user
      guestCart.user = req.user._id;
      guestCart.guestId = undefined;
      await guestCart.save();

      return res.status(200).json(guestCart);
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports=router;