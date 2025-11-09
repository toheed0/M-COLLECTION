const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Cart = require('./models/cart');
const Product = require('./models/product');
const products = require('./data/products');


dotenv.config();

mongoose.connect(process.env.MONGODB_URL);


const seedData = async () => {
    try{
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        const createdUsers = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password',
            role: 'admin',
        });
        const userId= createdUsers._id;
        const sampleProducts = products.map((product) => {
            return { ...product,  user: userId };
        });
        await Product.insertMany(sampleProducts);
        console.log('Data seeded successfully');
        process.exit();
    }catch(error){
        console.error('Data seeding failed:', error);
        process.exit(1);
        
    }
};

seedData();