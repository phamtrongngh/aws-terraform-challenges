import express from 'express';
import dotenv from 'dotenv';
import data from './data.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// List all products
app.get('/product-svc/products', (req, res) => {
    res.json({
        message: "success",
        data,
    });
});

// Get product by id
app.get('/product-svc/products/:id', (req, res) => {
    const product = data.find((p) => p.id === parseInt(req.params.id));
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
    } else {
        res.json({
            message: "success",
            data: product,
        });
    }
});

// Health check
app.get('/product-svc/health', (req, res) => {
    res.json({
        message: "success",
    });
});

app.listen(port, () => {
    console.log(`Product Service listening at http://localhost:${port}`);
});