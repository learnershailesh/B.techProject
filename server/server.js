const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const ethers = require("ethers");
const dotenv = require('dotenv');
dotenv.config({path: './.env'});


const app = express();
app.use(cors());
app.use(express.json());

// Update your User model (in models/User.js)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  walletAddress: String, // Add this field for MetaMask users
  nonce: String, // Add this field for MetaMask authentication
  authType: {
    type: String,
    enum: ['email', 'metamask'],
    required: true
  }
});

const User = mongoose.model('User', userSchema);

// Set up file upload using multer
const upload = multer({ dest: "uploads/" });

mongoose.connect( process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Helper function to generate nonce
const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

// Helper function to verify Ethereum signature
const verifySignature = (message, signature, address) => {
  try {
    const signerAddr = ethers.verifyMessage(message, signature);
    return signerAddr.toLowerCase() === address.toLowerCase();
  } catch (err) {
    console.error('Signature verification failed:', err);
    return false;
  }
};

// Traditional email/password login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, authType: 'email' });
    
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, authType: 'email' }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Traditional email/password registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email, authType: 'email' },
        { email, authType: 'metamask' }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      authType: 'email'
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// MetaMask Authentication Routes

// Step 1: Get nonce for MetaMask signin
app.post("/auth/metamask/nonce", async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    let user = await User.findOne({ walletAddress, authType: 'metamask' });
    
    if (!user) {
      // Create new user if wallet address not found
      user = new User({
        walletAddress,
        nonce: generateNonce(),
        authType: 'metamask'
      });
      await user.save();
    } else {
      // Update nonce for existing user
      user.nonce = generateNonce();
      await user.save();
    }

    res.json({ 
      nonce: user.nonce,
      message: `Welcome to Real Estate DApp! Please sign this message to verify your wallet ownership. Nonce: ${user.nonce}`
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Step 2: Verify signature and complete MetaMask registration/login
app.post("/auth/metamask/verify", async (req, res) => {
  try {
    const { walletAddress, signature, name = '' } = req.body;
    
    const user = await User.findOne({ walletAddress, authType: 'metamask' });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const message = `Welcome to Real Estate DApp! Please sign this message to verify your wallet ownership. Nonce: ${user.nonce}`;
    
    const isValidSignature = verifySignature(message, signature, walletAddress);
    if (!isValidSignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update user info if name is provided (for first-time registration)
    if (name) {
      user.name = name;
      await user.save();
    }

    // Generate new nonce for next login
    user.nonce = generateNonce();
    await user.save();

    const token = jwt.sign(
      { id: user._id, authType: 'metamask', walletAddress }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        walletAddress: user.walletAddress 
      } 
    });
  } catch (error) {
    console.error('MetaMask verification error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start the server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

