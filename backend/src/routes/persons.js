const express = require("express");
const router = express.Router();
const Person = require("../models/Person");

router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching user ID:", req.params.id);

    const person = await Person.findByPk(req.params.id);

    console.log("Person fetched:", person);

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.json(person);
  } catch (err) {
    console.error("Sequelize / Backend error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
