import express from 'express';
import dotenv from 'dotenv';
import data from './data.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// List all users
app.get('/user-svc/users', (req, res) => {
    res.json({
        message: "success",
        data,
    });
});

// Get users by id
app.get('/user-svc/users/:id', (req, res) => {
    const user = data.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.json({
            message: "success",
            data: user,
        });
    }
});

// Health check
app.get('/user-svc/health', (req, res) => {
    res.json({
        message: "success",
    });
});

app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});