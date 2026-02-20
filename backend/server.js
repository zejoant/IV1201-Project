require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const reqHandlerLoader = require("./src/api");

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Main server entry point for the application.
 *
 * Sets up Express, middleware, static file serving, and loads
 * request and error handlers. Also starts the server on the
 * configured port.
 *
 * @module server
 *
 */

/**
 * Configure Express middleware:
 * - CORS: allows frontend dev server at http://localhost:3000
 * - JSON parsing for request bodies
 * - Cookie parsing
 */
const allowedOrigins = [
  "http://localhost:3000", // local dev
  process.env.FRONTEND_URL // Azure frontend
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type"],
  credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

/**
 * Load all API request handlers and error handlers
 * using the RequestHandlerLoader.
 */
reqHandlerLoader.loadHandlers(app);
reqHandlerLoader.loadErrorHandlers(app);

/**
 * Serve static files from the 'public' folder (React build).
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Catch-all route to serve index.html for client-side routing.
 * Works for Express 4; for Express 5, may need to change "*" to "/*".
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * Starts the Express server on the configured port.
 *
 * @param {number} PORT - Port number from environment or default 3001.
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
