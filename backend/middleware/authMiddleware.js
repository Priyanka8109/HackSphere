const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * JWT Authentication Middleware
 * 1. Checks Authorization header for Bearer <token>
 * 2. Verifies token with JWT_SECRET
 * 3. Attaches authenticated user to req.user (excluding password)
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    const secret = process.env.JWT_SECRET || "hacksphere_jwt_secure_secret_key_2026";
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Attach decoded user info
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token is invalid.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};

/**
 * Role-Based Authorization Middleware
 * Verifies that the authenticated user possesses one of the allowed roles.
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: insufficient permissions.",
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  verifyToken: authenticateToken,
  isAdmin: authorizeRoles("admin"),
};
