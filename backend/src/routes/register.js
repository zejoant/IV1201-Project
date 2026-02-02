const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

// register new user
router.post("/", async (req, res) => {
  try {
    const { name, username, password, email, surname, role_id } = req.body;

    // basic validation
    if (!name || !username || !password) {
      return res.status(400).json({ 
        message: "Name, username and password are required" 
      });
    }

    // Create new user
    const newPerson = await authService.register({
      name,
      surname: surname || "",
      username,
      password,
      email: email || "",
      role_id: role_id || 2,
      pnr: ""
    });

    // Respond with created user details
    res.status(201).json({
      message: "User created successfully",
      user: {
        person_id: newPerson.person_id,
        name: newPerson.name,
        surname: newPerson.surname,
        username: newPerson.username,
        email: newPerson.email,
        role_id: newPerson.role_id
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    
    if (err.message === "Username already exists") {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: "Server error during registration" });
  }
});

module.exports = router;