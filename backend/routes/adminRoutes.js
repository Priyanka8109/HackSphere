const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ADMIN-ONLY ROUTE: GET /api/admin/users
// Requires valid JWT token AND role === "admin"
router.get("/users", authenticateToken, authorizeRoles("admin"), userController.getAllUsers);

module.exports = router;
