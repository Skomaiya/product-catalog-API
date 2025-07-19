const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const setupSwaggerDocs = require('./swagger');


const app = express();
app.use(cors());
app.use(express.json());

setupSwaggerDocs(app);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
const variantRoutes = require('./routes/variantRoutes');
app.use('/api/variants', variantRoutes);
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', inventoryRoutes);
const pricingRoutes = require('./routes/pricingRoutes');
app.use('/api/pricing', pricingRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running`);
        });
    })
    .catch((err) => console.error(err));
