const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const rewardRoutes = require('./routes/rewards');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/users', userRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
