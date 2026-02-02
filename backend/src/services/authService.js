const Person = require("../models/Person");

async function login(username, password) {
  // Find user by username and password
  const person = await Person.findOne({ where: { username, password } });
  if (!person) return null;

  return person;
}

module.exports = { login };
