const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { loginLimiter } = require("../middleware/rateLimiter");
const userController = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Validation rules for registration
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

// Validation rules for login
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

// 1. REGISTER USER
// POST /api/users/register
router.post("/register", registerValidation, userController.register);

// 2. LOGIN USER
// POST /api/users/login (with rate limiting and input validation)
router.post("/login", loginLimiter, loginValidation, userController.login);

// 3. GET PROFILE (Protected Route - Requires valid JWT)
// GET /api/users/profile
router.get("/profile", authenticateToken, userController.getProfile);

// 4. ADMIN ONLY: GET ALL USERS (Protected Route - Requires Admin Role)
// GET /api/users/admin/users
router.get("/admin/users", authenticateToken, authorizeRoles("admin"), userController.getAllUsers);

module.exports = router;
