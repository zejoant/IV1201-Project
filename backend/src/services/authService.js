const Person = require("../models/Person");

async function login(username, password) {
  // Find user by username and password
  const person = await Person.findOne({ where: { username, password } });
  if (!person) return null;

  return person;
}

async function register(userData) {
  // Check if username already exists
  const existingUser = await Person.findOne({
    where: { username: userData.username }
  });
  
  if (existingUser) {
    throw new Error("Username already exists");
  }
  
  // Create new user
  const newPerson = await Person.create(userData);
  
  return newPerson;
}

module.exports = { login, register };
