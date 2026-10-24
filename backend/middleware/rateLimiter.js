const rateLimit = require("express-rate-limit");

/**
 * Login Rate Limiter (Experiment 5 & Experiment 6)
 * Protects login endpoints against brute-force credential stuffing attacks.
 * Limits each IP to 5 login attempts within a 15-minute window.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 login attempts per window per IP
  standardHeaders: true, // Return standard `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  statusCode: 429,
  message: {
    success: false,
    message: "Too many login attempts from this IP, please try again after 15 minutes.",
  },
});

module.exports = {
  loginLimiter,
};
