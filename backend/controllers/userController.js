const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// 1. REGISTER USER
// POST /api/users/register
const register = async (req, res) => {
  try {
    // Check validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      });
    }

    // Password hashing using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (safe default role: "user")
    const assignedRole = role && ["user", "admin"].includes(role) ? role : "user";
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    // Return safe user object (no password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// 2. LOGIN USER
// POST /api/users/login
const login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "hacksphere_jwt_secure_secret_key_2026";
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "1d" }
    );

    // Return token and safe user details (no password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// 3. GET USER PROFILE (Protected route)
// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving profile",
      error: error.message,
    });
  }
};

// 4. GET ALL USERS (Admin-only route)
// GET /api/admin/users OR GET /api/users/admin/all
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error retrieving users",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers,
};
