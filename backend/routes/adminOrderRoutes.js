const express = require('express');
const Order = require('../models/order');
const { protect, admin } = require('../midleware/authMidleware');

const router = express.Router();
//route get api/admin/orders
//get all orders admin only
//access private/admin
router.get('/', protect, admin, async (req, res) => {
    try{
        const orders = await Order.find({}).populate('user', 'name email');
        res.json(orders);

}catch(error){
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//route put api/admin/orders/:id
//update order status admin only
//access private/admin

router.put('/:id', protect, admin, async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if(order){
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt=req.body.status ==="Delivered"? Date.now() : order.deliveredAt;

            const updatedOrder=await order.save();
            res.json(updatedOrder);
        }else{
            res.status(404).json({message:"Order not found"})
        }

    }catch(error){
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// delete api/admin/orders/:id
//delete the orders by admin
//access private/admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id);
        if(order){
            await order.deleteOne();
            res.json({message:"Order Delete Successfully"});
        }else{
            res.status(404).json({message:"Order not Found"});
        }

    }catch(error){
            console.error('Error deleting orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;