const express = require("express");
const cors = require("cors");
const sequelize = require("./src/db");
const userRoutes = require("./src/routes/users");
const path = require("path");
require("dotenv").config();

const app = express();

// CORS — allow your frontend dev server
app.use(cors());
app.use(express.json());

// Test DB connection
sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection failed:", err));

// Routes
app.use("/api/users", userRoutes);

// Simple test
//app.get("/", (req, res) => res.send("API is running"));

//serve the static files in build
app.use(express.static(path.join(__dirname, 'public')));

//app.get("*") only works with express 4, if express 5 is being used this has to be changed to /* or other
app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', "index.html"));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
