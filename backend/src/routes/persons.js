const express = require("express");
const router = express.Router();
const DAO = require("../integration/DAO")

router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching user ID:", req.params.id);

    const person = await DAO.findUserByPk(req.params.id)

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
