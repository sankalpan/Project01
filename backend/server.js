const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const bookmarkRoutes = require("./routes/bookmarks");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://mern-stack-project-backend-5osd.onrender.com",
  "https://news-monkey-project.onrender.com",
  "https://news-monkey-project1.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Temporary: allow all origins during debugging. Remove before production.
app.use(cors());

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is running",
    env_check: {
      GNEWS_API_KEY: process.env.GNEWS_API_KEY ? "SET" : "NOT SET",
      MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    }
  });
});

app.use("/api", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api", newsRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server immediately (don't wait for MongoDB)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB in the background
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.warn("Server running without MongoDB. Auth routes will fail but news should work.");
  });
