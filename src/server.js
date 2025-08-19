require("dotenv").config();

const express = require("express");
const path = require("path");

const app = require("./app"); // Express app
const db = require("./config/database");

// Import all models before syncing DB
require("./models/user/userModel");

// Import routes
const uploadRoute = require("../uploads/upload"); 

const PORT = process.env.PORT || 3000;

// ---------------------------
// Serve Static Files
// ---------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));     // For images
app.use('/documents', express.static(path.join(__dirname, 'documents'))); // For documents

// ---------------------------
// Use Routes
// ---------------------------
app.use('/upload', uploadRoute);

const productRoute = require("./routes/productRoute");
app.use("/products", productRoute);

// ---------------------------
// Start Server After DB Sync
// ---------------------------
db.sync({ alter: true })
  .then(() => {
    console.log("✅ All tables created successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error syncing DB:", err);
  });
