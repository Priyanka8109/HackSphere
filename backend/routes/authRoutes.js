const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");

// Validation rules for registration (Experiment 5 & 6)
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for login (Experiment 5 & 6)
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const { loginLimiter } = require("../middleware/rateLimiter");

// 1. REGISTER USER: POST /api/auth/register
router.post("/register", registerValidation, userController.register);

// 2. LOGIN USER: POST /api/auth/login (with rate limiting and input validation)
router.post("/login", loginLimiter, loginValidation, userController.login);

module.exports = router;
