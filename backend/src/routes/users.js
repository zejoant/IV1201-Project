const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching user ID:", req.params.id);

    const user = await User.findByPk(req.params.id);

    console.log("User fetched:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("Sequelize / Backend error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
