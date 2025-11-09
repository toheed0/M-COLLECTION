const express = require('express');

const User = require('../models/user');
const { protect, admin } = require('../midleware/authMidleware');


const router = express.Router();

//route get api/admin/users
//get all users admin only
//access private/admin


router.get('/', protect, admin, async (req, res) => {
    try{
        const users = await User.find({})
        res.status(200).json(users);

    }catch(error){
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

//route post api/admin/users
//create a new user admin only
//access private/admin
router.post('/', protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body;
    try{
        let user=await User.findOne({email});
        if(user){
            res.status(400).json({message:"User already exist"})
        }
        user=new User({name,email,password,role:role||"customer",});
        await user.save();
        res.status(201).json({message:"User created successfully", user});
    }catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//route put api/admin/users/:id
//update user details admin only
//access private/admin
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(user){
            user.name=req.body.name||user.name;
            user.email=req.body.email||user.email;
            user.role=req.body.role||user.role;

        }
        const updatedUser=await user.save();
        res.status(200).json({message:"User updated successfully", user:updatedUser});

    }catch(error){
         console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

//route delete api/admin/users/:id
//delete a user admin only
//access private/admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:"User Delete Successfully"});
        }else{
            res.status(404).json({message:"User not Found"});
        }

    }catch(error){
            console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;