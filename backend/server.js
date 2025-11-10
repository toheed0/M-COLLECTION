const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// ✅ Connect MongoDB (serverless-friendly)
connectDB();

// ✅ Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // use env in production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ✅ Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api', require('./routes/subscriberRoutes'));
app.use('/api/admin/users', require('./routes/adminRoutes'));
app.use('/api/admin/products', require('./routes/productAdminRoutes'));
app.use('/api/admin/orders', require('./routes/adminOrderRoutes'));
app.use("/api/payment", require("./routes/paymentRoute"));

// ✅ Root route
app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

// ✅ Export app for Vercel serverless
module.exports = app;

// ✅ Local dev only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
