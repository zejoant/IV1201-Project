const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();

// CORS — allow your frontend dev server
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Test DB connection
sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection failed:", err));

// Routes
app.use("/api/users", userRoutes);

// Simple test
app.get("/", (req, res) => res.send("API is running"));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
