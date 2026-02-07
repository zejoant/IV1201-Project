const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const reqHandlerLoader = require("./src/api");
require("dotenv").config();

const app = express();

// CORS — allow your frontend dev server
app.use(cors({origin: "http://localhost:3000", credentials:true}));
app.use(express.json());

app.use(cookieParser());

reqHandlerLoader.loadHandlers(app);

//serve the static files in build
app.use(express.static(path.join(__dirname, "public")));

//app.get("*") only works with express 4, if express 5 is being used this has to be changed to /* or other
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
