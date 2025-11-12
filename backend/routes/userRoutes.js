const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { protect } = require('../midleware/authMidleware');



router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });

        }
        const user = new User({ name, email, password });
        await user.save();
        const payload = { user: { id: user._id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ 
               user:{ id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
               },
                token,

             });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

//login router 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });

    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return  res.status(400).json({message:'Invalid Email'});
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid Password'});
        }
        const payload = { user: { id: user._id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ 
               user:{ id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
               },
                token,

             });
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Server error' });
    }
});

//user profile route
router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// ===================== REFRESH TOKEN =====================
router.post('/refresh-token', async (req, res) => {
  const { token } = req.body; // client se purana token aayega
  if (!token) return res.status(400).json({ message: "No token provided" });

  try {
    // Purana token decode kar le (expiration ignore)
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Naya token generate karo
    const payload = { user: { id: user._id, role: user.role } };
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Naya token client ko bhej do
    res.json({ token: newToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
