const postgresDB = require("./db");
const JobApplication = require("../models/JobApplication");
const Person = require("../models/Person");
const PersonDTO = require("../models/PersonDTO");
const Availability = require("../models/Availability");
const AvailabilityDTO = require("../models/AvailabilityDTO");
const CompetenceProfile = require("../models/CompetenceProfile");
const CompetenceProfileDTO = require("../models/CompetenceProfileDTO")
//const Op = require("sequelize"); dumb

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

  getTransactionManager(){
    return this.db;
  }

  async findUser(username) {
    // Find user by username
    try{
      const person = await Person.findOne({where: {username}});
      if (!person) return null;
  
      return this.createPersonDTO(person);
    }
    catch (err){
      console.log(err)
    }
  }

  async createPerson({name, surname, pnr, email, username, password, role_id}) {
    if (!name || !surname || !email || !username || !password) {
      throw new Error("Missing required fields");
    }

    //Check if user already exists
    //const existingUser = await Person.findOne({where: {[Op.or]:[{username}, {pnr}, {email}]}}); future problem to solve
    const existingUser = await Person.findOne({where: {username, pnr, email}});

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const newPerson = await Person.create({name, surname, pnr, email, password, role_id, username});

    return this.createPersonDTO(newPerson);
  }

  async findUserByPk(id) {
    return await Person.findByPk(id);
  }

  async submitApplication(id, status) {
    if (!id || !status) {
      throw new Error("Missing required fields");
    }

    const newApp = await JobApplication.create({person_id: id, status: status});

    return newApp;
  }

  async addExpertise(id, expertise){
    if (!id || !expertise) {
      throw new Error("Missing required fields");
    }

    const newExpertise = CompetenceProfile.create({person_id: id, compentence_id: expertise.compentence_id, years_of_experience: expertise.yoe});

    return this.createCompetenceProfileDTO(newExpertise);
  }

  async addAvailability(id, availability){
    if (!id || !availability) {
      throw new Error("Missing required fields");
    }

    const newAvailibility = Availability.create({person_id: id, fromDate: availability.fromDate, toDate: availability.toDate});

    return this.createAvailabilityDTO(newAvailibility);
  }

  createPersonDTO(person) {
    return new PersonDTO(
        person.person_id,
        person.name,
        person.surname,
        person.pnr,
        person.email,
        person.password,
        person.role_id,
        person.username,
    );
  }

  createAvailabilityDTO(ava) {
    return new AvailabilityDTO(
        ava.availability_id,
        ava.person_id,
        ava.from_date,
        ava.to_date,
    );
  }

  createCompetenceProfileDTO(comp) {
    return new CompetenceProfileDTO(
        comp.competence_profile_id,
        comp.person_id,
        comp.competence_id,
        comp.years_of_experience,
    );
  }

}

module.exports = DAO;
