// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const paymentRoute = require('./routes/paymentRoute');

dotenv.config();
connectDB();

const app = express();

// ----------------- MIDDLEWARE -----------------
app.use(cors({
  origin: '*', // Vercel frontend deploy ke liye
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ----------------- ROUTES -----------------
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', subscriberRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use("/api/payment", paymentRoute);

// Test root route
app.get('/', (req, res) => {
  res.send('Hello from backend server!');
});

// ----------------- SERVERLESS EXPORT -----------------
module.exports = app;
