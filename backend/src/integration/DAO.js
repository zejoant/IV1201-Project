const Person = require("../models/Person");
const JobApplication = require("../models/JobApplication");
const postgresDB = require("./db");

class DAO {
  constructor() {
    this.db = postgresDB;
  }

  async connectToDatabase() {
    try {
      await this.db.authenticate();
      console.log("DB connected successfully");
    } catch (err) {
      console.error("DB connection failed:", err);
      throw err;
    }
  }

  async login(username, password) {
    // Find user by username and password
    const person = await Person.findOne({ where: { username, password } });
    if (!person) return null;

    return person;
  }

  async findUserByPk(id) {
    return await Person.findByPk(id);
  }

  async submitApplication({
    person_id,
    expertise,
    years_experience,
    availability,
  }) {
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
}

module.exports = DAO;
