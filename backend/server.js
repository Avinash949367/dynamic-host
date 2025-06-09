const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Save user
app.post('/api/users', async (req, res) => {
  const { name, age, phone } = req.body;

  // Basic validation
  if (!name || !age || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = new User({ name, age, phone });
    await user.save();
    res.status(201).json({ message: '✅ User saved!' });
  } catch (err) {
    res.status(500).json({ message: `❌ Error saving user: ${err.message}` });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: `❌ Error fetching users: ${err.message}` });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
