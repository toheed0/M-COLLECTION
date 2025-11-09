const express = require('express');

const router = express.Router();
const Subscriber = require('../models/subscriber');


//route post api/subscribers
//desc handle a newletter subscriber
//access public

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try{
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }
        subscriber = new Subscriber({ email });
        await subscriber.save();
        return res.status(201).json({ message: 'Subscribed successfully' });

    }catch(error){
        console.error('Error subscribing to newsletter:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

});

module.exports = router;