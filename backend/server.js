const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const cartRoutes=require('./routes/cartRoutes');
const checkoutRoutes=require('./routes/checkoutRoutes');
const orderRoutes=require('./routes/orderRoutes');
const uploadRoutes=require('./routes/uploadRoutes');
const subscriberRoutes=require('./routes/subscriberRoutes');
const adminRoutes=require('./routes/adminRoutes');
const productAdminRoutes=require('./routes/productAdminRoutes');
const adminOrderRoutes=require('./routes/adminOrderRoutes');

dotenv.config();

const app = express();
connectDB();

// ✅ Middleware routes se pehle likho
app.use(cors({
     origin: 'http://localhost:5173', // ✅ Specific origin instead of wildcard
  credentials: true, // ✅ Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Routes yahan baad me likho
app.use('/api/users', userRoutes);
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes);
app.use('/api/checkout',checkoutRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api',subscriberRoutes);
app.use('/api/admin/users',adminRoutes);
app.use('/api/admin/products',productAdminRoutes);
app.use('/api/admin/orders',adminOrderRoutes);
app.use("/api/payment", require("./routes/paymentRoute"));


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
