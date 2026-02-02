const Person = require("../models/Person");
const JobApplication = require("../models/JobApplication");

async function login(username, password) {
  // Find user by username and password
  const person = await Person.findOne({ where: { username, password } });
  if (!person) return null;

  return person;
}

async function findUserByPk(id){
    return await Person.findByPk(id);
}

async function submitApplication({ person_id, expertise, years_experience, availability }) {
  if (!person_id || !expertise || !years_experience || !availability) {
    throw new Error("Missing required fields");
  }

  const newApp = await JobApplication.create({
    person_id,
    expertise,
    years_experience,
    availability,
  });

  return newApp;
}

module.exports = { login, findUserByPk, submitApplication };