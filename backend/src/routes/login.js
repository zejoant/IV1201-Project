const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    const person = await authService.login(username, password);

    if (!person) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // For now, just return user info (no JWT/session yet)
    res.json({
      id: person.person_id,
      name: person.name,
      username: person.username,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
