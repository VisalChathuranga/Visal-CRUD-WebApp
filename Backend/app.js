const express = require('express');
const mongoose = require('mongoose');
const router = require('./Routes/UserRoutes'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors());

// JWT Secret (store this securely in environment variables in production)
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET 

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

mongoose.connect("mongodb+srv://admin:nwxZtyn5qxypSMk6@cluster0.e7pwhnp.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));

// Register Model
require("./Model/Register");
const User = mongoose.model("Register");

// Register Endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json({ status: "success", message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: "success", message: "Login successful", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// Protected CRUD Routes
app.use('/users', authenticateToken, router);