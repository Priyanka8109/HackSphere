const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Route & Controller imports
const hackathonEventRoutes = require("./routes/hackathonEventRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { authenticateToken, authorizeRoles } = require("./middleware/authMiddleware");
const { getAllUsers } = require("./controllers/userController");

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Nginx) to correctly obtain client IP for rate limiting

// ==================================================
// SECURITY & UTILITY MIDDLEWARES (Experiment 5 & 6)
// ==================================================
// 1. Helmet: Secure HTTP headers
app.use(helmet());

// 2. CORS: Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
);

// 3. Body parser: Parse incoming JSON payloads
app.use(express.json());

// ==================================================
// ROUTES
// ==================================================
// Base Health Check Route (Preserved from Experiment 4)
app.get("/", (req, res) => {
  res.send("HackSphere API is Running");
});

// Experiment 4: Hackathon Event CRUD Routes
app.use("/api/hackathons", hackathonEventRoutes);

// Experiment 6: Dedicated Authentication Routes (/api/auth/register, /api/auth/login)
app.use("/api/auth", authRoutes);

// Experiment 5 & 6: User Authentication & Profile Routes (/api/users/profile, etc.)
app.use("/api/users", userRoutes);

// Experiment 6: Dedicated Admin Routes (/api/admin/users)
app.use("/api/admin", adminRoutes);

// Direct Route Alias for /api/admin/users
app.get("/api/admin/users", authenticateToken, authorizeRoles("admin"), getAllUsers);

// ==================================================
// SECURE ERROR HANDLING (Experiment 5)
// ==================================================
// 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  // Prevent logging stack traces or sensitive credentials in response
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errorDetails = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Database Validation Failed",
      errors: errorDetails,
    });
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({
      success: false,
      message: `Duplicate field value entered: ${field}. Please use another value.`,
    });
  }

  // Handle Mongoose invalid ObjectId (CastError)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid format for resource ID: ${err.value}`,
    });
  }

  // General server error response (no sensitive internals leaked)
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

// ==================================================
// SERVER INITIALIZATION & DATABASE CONNECTION
// ==================================================
const PORT = process.env.PORT || 5000;

async function startServer() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/HackSphereDB";

  // If testing locally on 127.0.0.1, auto-start local in-memory MongoDB service if port is free
  if (MONGO_URI.includes("127.0.0.1") || MONGO_URI.includes("localhost")) {
    try {
      const { startLocalMongo } = require("./localMongo");
      await startLocalMongo(27017);
    } catch (err) {
      // Local service already running or handled
    }
  }

  // MongoDB Connection using Mongoose
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected successfully to HackSphereDB");
    })
    .catch((error) => {
      console.error("MongoDB Connection Error:", error);
    });

  // Create HTTP server and attach Socket.IO
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('chatMessage', (msg) => {
      // Broadcast to all clients
      io.emit('chatMessage', msg);
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const server = httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running securely on port ${PORT} (0.0.0.0)`);
  });

  return { app, server, io };
}

// Start server if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
