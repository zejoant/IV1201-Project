const postgresDB = require("./db");
const JobApplication = require("../models/JobApplication");
const JobApplicationDTO = require("../models/JobApplicationDTO")
const Person = require("../models/Person");
const PersonDTO = require("../models/PersonDTO");
const Availability = require("../models/Availability");
const AvailabilityDTO = require("../models/AvailabilityDTO");
const CompetenceProfile = require("../models/CompetenceProfile");
const CompetenceProfileDTO = require("../models/CompetenceProfileDTO")
const Competence = require("../models/Competence");
const CompetenceDTO = require("../models/CompetenceDTO")
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

  async findUserById(id) {
    return await Person.findByPk(id);
  }

  async findCompProfileByUserId(id){
    const newCompProfile = await CompetenceProfile.findAll({where: {person_id: id}})

    const newCompProfileArray = newCompProfile.map((input) => this.createCompetenceProfileDTO(input))

    return newCompProfileArray;
  }

  async findCompByUserId(id){
    const newComp = await Competence.findOne({where: {competence_id: id}})

    return this.createCompetenceDTO(newComp)
  }

  async findAvaByUserId(id){
    const newAva = await Availability.findAll({where: {person_id: id}})

    const newAvaArray = newAva.map((input) => this.createAvailabilityDTO(input))

    return newAvaArray;
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
    const newExpertise = await CompetenceProfile.create({person_id: id, competence_id: expertise.competence_id, years_of_experience: expertise.yoe});

    return this.createCompetenceProfileDTO(newExpertise);
  }

  async addAvailability(id, availability){
    if (!id || !availability) {
      throw new Error("Missing required fields");
    }

    const newAvailibility = await Availability.create({person_id: id, from_date: new Date(availability.from_date), to_date: new Date(availability.to_date)});

    return this.createAvailabilityDTO(newAvailibility);
  }

  async getCompetence(){
    const newCompetence = await Competence.findAll();

    const newCompetenceArray = newCompetence.map((input) => this.createCompetenceDTO(input))

    return newCompetenceArray;
  }

  async listApplications(){
    const applications = await JobApplication.findAll();

    const newApplicationArray = applications.map((input) => this.createJobApplicationDTO(input))

    return newApplicationArray;
  }

  async updateApplication(body){

    return await JobApplication.update({
      status: body.status
    },
    {where: {job_application_id: body.job_application_id}})
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

  createCompetenceProfileDTO(compProfile) {
    return new CompetenceProfileDTO(
        compProfile.competence_profile_id,
        compProfile.person_id,
        compProfile.competence_id,
        compProfile.years_of_experience,
    );
  }

  createCompetenceDTO(comp){
    return new CompetenceDTO(
      comp.competence_id,
      comp.name,
    );
  }

  createJobApplicationDTO(job){
    return new JobApplicationDTO(
      job.job_application_id,
      job.person_id,
      job.status
    );
  }

}

module.exports = DAO;
