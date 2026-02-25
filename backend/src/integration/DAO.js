const postgresDB = require("./db");
const JobApplication = require("../models/JobApplication");
const JobApplicationDTO = require("../models/JobApplicationDTO");
const Person = require("../models/Person");
const PersonDTO = require("../models/PersonDTO");
const Availability = require("../models/Availability");
const AvailabilityDTO = require("../models/AvailabilityDTO");
const CompetenceProfile = require("../models/CompetenceProfile");
const CompetenceProfileDTO = require("../models/CompetenceProfileDTO");
const Competence = require("../models/Competence");
const CompetenceDTO = require("../models/CompetenceDTO");
const WError = require('verror').WError;
const Checker = require("../util/Checkers");
//const Op = require("sequelize"); dumb

/**
 * Data Access Object responsible for database operations.
 * Provides methods for managing persons, applications,
 * competencies, and availability records.
 *
 * @public
 */
class DAO {

  /**
  * Creates a new DAO instance with a database connection.
  * @constructor
  */
  constructor() {
    this.db = postgresDB;
  }

  /**
 * Authenticates and establishes a database connection.
 *
 * @returns {Promise<void>}
 * @throws {Error} If connection fails.
 */
  async connectToDatabase() {
    try {
      await this.db.authenticate();
      console.log("DB connected successfully");
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: 'Failed to authenticate.' },
        },
        'Could not connect to database.',
      );
    }
  }

  /**
  * Returns the Sequelize transaction manager.
  *
  * @returns {Sequelize} Database instance.
  */
  getTransactionManager() {
    return this.db;
  }

  /**
   * Finds a user by username.
   *
   * @param {string} username - Username to search for.
   * @returns {Promise<PersonDTO|null>} Found user or null.
   */
  async findUser(username) {
    // Find user by username
    try {
      Checker.isLength(username, 3, 30, 'username');
      Checker.isAlphaNumeric(username, 'username');

      const person = await Person.findOne({ where: { username } });
      if (!person) return null;

      return this.createPersonDTO(person);
    }
    catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findOne where: username = ${username}` },
        },
        `unknown_error`,
      );
    }
  }

  /**
 * Creates a new person in the database.
 *
 * @param {string} name user name
 * @param {string} surname user surname
 * @param {string} pnr user personnummer
 * @param {string} email user email
 * @param {string} username user username
 * @param {string} password user password
 * @param {number} role_id user role id 
 * @returns {Promise<PersonDTO>} Created user.
 * @throws {Error} If validation fails or user exists.
 */
  async createPerson({ name, surname, pnr, email, username, password, role_id }) {
    try {
      Checker.notEmptyString(name, 'name');
      Checker.isAlpha(name, 'name');
      Checker.notEmptyString(surname, 'surname');
      Checker.isAlpha(surname, 'surname');
      Checker.isPositiveInteger(parseInt(pnr), 'person number');
      Checker.isLength(pnr, 12, 12, 'person number');
      Checker.isEmailString(email, 'email');
      Checker.isAlphaNumeric(username, 'username');
      Checker.isLength(username, 3, 30, 'username');
      Checker.isLength(password, 8, Number.MAX_SAFE_INTEGER);
      Checker.isInteger(role_id, 'role id')
      Checker.isNumberBetween(role_id, 1, 3, 'role id')

      if (!name || !surname || !email || !username || !password) {
        throw new Error('missing_field');
      }

      //Check if user already exists
      //const existingUser = await Person.findOne({where: {[Op.or]:[{username}, {pnr}, {email}]}}); future problem to solve
      const existingUser = await Person.findOne({ where: { username, pnr, email } });

      if (existingUser) {
        throw new Error('user_exists');
      }

      const newPerson = await Person.create({ name, surname, pnr, email, password, role_id, username });

      return this.createPersonDTO(newPerson);
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: 'Failed call sequelize call create or findOne.' },
        },
        `creation_failed`,
      );
    }
  }

  /**
 * Finds a user by primary key.
 *
 * @param {number} id - Person ID.
 * @returns {Promise<Person|null>}
 */
  async findUserById(id) {
    try {
      Checker.isPositiveInteger(id, 'person id')

      return await Person.findByPk(id);
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findByPk for ${id}.` },
        },
        'unknown_error',
      );
    }
  }

  /**
  * Retrieves competence profiles for a user.
  *
  * @param {number} id - Person ID.
  * @returns {Promise<CompetenceProfileDTO[]>}
  */
  async findCompProfileByUserId(id) {
    try {
      Checker.isPositiveInteger(id, 'person id')

      const newCompProfile = await CompetenceProfile.findAll({ where: { person_id: id } })

      const newCompProfileArray = newCompProfile.map((input) => this.createCompetenceProfileDTO(input))

      return newCompProfileArray;
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findAll for ${id} or failed createCompetenceProfileDTO.` },
        },
        'competence_not_found',
      );
    }
  }

  /**
  * Retrieves competence information by competence ID.
  *
  * @param {number} id - Competence ID.
  * @returns {Promise<CompetenceDTO>}
  */
  async findCompByUserId(id) {
    try {
      Checker.isPositiveInteger(id, 'competence id')

      const newComp = await Competence.findOne({ where: { competence_id: id } })
      return this.createCompetenceDTO(newComp)
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findOne for ${id}.` },
        },
        'competence_not_found',
      );
    }
  }

  /**
 * Retrieves availability records for a user.
 *
 * @param {number} id - Person ID.
 * @returns {Promise<AvailabilityDTO[]>}
 */
  async findAvaByUserId(id) {
    try {
      Checker.isPositiveInteger(id, 'person id')

      const newAva = await Availability.findAll({ where: { person_id: id } })

      const newAvaArray = newAva.map((input) => this.createAvailabilityDTO(input))

      return newAvaArray;
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findAll for ${id} or createAvailabilityDTO` },
        },
        'availability_not_found.',
      );
    }
  }

  /**
  * Submits a new job application.
  *
  * @param {number} id - Person ID.
  * @param {string} status - Application status.
  * @returns {Promise<JobApplication>}
  * @throws {Error} If required fields are missing.
  */
  async submitApplication(id, status) {
    try {
      Checker.isPositiveInteger(id, 'person id')
      Checker.isMatches(status, /^(unhandled|rejected|accepted)$/, 'status');

      if (!id || !status) {
        throw new Error("missing_field");
      }

      const newApp = await JobApplication.create({ person_id: id, status: status });
      console.log(newApp)

      return newApp;
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call create for ${id}` },
        },
        'invalid_application',
      );
    }
  }

  /**
 * Adds a competence profile for a user.
 *
 * @param {number} id - Person ID.
 * @param {Object} expertise - Expertise data.
 * @returns {Promise<CompetenceProfileDTO>}
 */
  async addExpertise(id, expertise) {
    try {
        Checker.isPositiveInteger(id, 'person id')
        Checker.isPositiveInteger(expertise.competence_id, 'competence id')
        Checker.isNumeric(expertise.yoe, 'years of experience')
        Checker.isNumberBetween(expertise.yoe, 0, 50, 'years of experience')
      
      if (!id || !expertise) {
        throw new Error("missing_field");
      }
      const newExpertise = await CompetenceProfile.create({ person_id: id, competence_id: expertise.competence_id, years_of_experience: expertise.yoe });

      return this.createCompetenceProfileDTO(newExpertise);
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call create for ${id}` },
        },
        'cannot_add_competence',
      );
    }
  }

  /**
 * Adds availability dates for a user.
 *
 * @param {number} id - Person ID.
 * @param {Object} availability - Availability period.
 * @returns {Promise<AvailabilityDTO>}
 */
  async addAvailability(id, availability) {
    try {
      Checker.isPositiveInteger(id, 'person id')
      Checker.isDateString(availability.from_date, 'from date')
      Checker.isDateString(availability.to_date, 'to date')

      if (!id || !availability) {
        throw new Error("missing_field");
      }

      const newAvailibility = await Availability.create({ person_id: id, from_date: new Date(availability.from_date), to_date: new Date(availability.to_date) });

      return this.createAvailabilityDTO(newAvailibility);
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call create for ${id}` },
        },
        'cannot_add_ava',
      );
    }
  }

  /**
 * Retrieves all competencies.
 *
 * @returns {Promise<CompetenceDTO[]>}
 */
  async getCompetence() {
    try {
      const newCompetence = await Competence.findAll();

      const newCompetenceArray = newCompetence.map((input) => this.createCompetenceDTO(input))

      return newCompetenceArray;
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findAll for ${id} or createCompetenceDTO` },
        },
        'competence_not_found',
      );
    }
  }

  /**
 * Retrieves all job applications.
 *
 * @returns {Promise<JobApplicationDTO[]>}
 */
  async listApplications() {
    try {
      const applications = await JobApplication.findAll();

      const newApplicationArray = applications.map((input) => this.createJobApplicationDTO(input))

      return newApplicationArray;
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: 'Failed sequelize call findAll or createJobApplicationDTO' },
        },
        'no_applications',
      );
    }
  }

  /**
  * Updates the status of a job application.
  *
  * @param {number} body.job_application_id identifier for job application 
  * @param {string} body.status status of the application
  * @returns {Promise<Array<number>>} Number of affected rows.
  */
  async updateApplication(body) {
    try {
      Checker.isMatches(body.status, /^(unhandled|rejected|accepted)$/, 'status' );
      Checker.isPositiveInteger(body.job_application_id, 'job app id');

      return await JobApplication.update({ status: body.status }, { where: { job_application_id: body.job_application_id } })
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { DAO: `Failed sequelize call findAll for ${body.job_application_id}` },
        },
        'status_change.',
      );
    }
  }

  /**
   * Creates a PersonDTO from a Person model.
   * @param {Person} person
   * @returns {PersonDTO}
   */
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

  /**
 * Creates an AvailabilityDTO.
 * @param {Availability} ava
 * @returns {AvailabilityDTO}
 */
  createAvailabilityDTO(ava) {
    return new AvailabilityDTO(
      ava.availability_id,
      ava.person_id,
      ava.from_date,
      ava.to_date,
    );
  }

  /**
   * Creates a CompetenceProfileDTO.
   * @param {CompetenceProfile} compProfile
   * @returns {CompetenceProfileDTO}
   */
  createCompetenceProfileDTO(compProfile) {
    return new CompetenceProfileDTO(
      compProfile.competence_profile_id,
      compProfile.person_id,
      compProfile.competence_id,
      compProfile.years_of_experience,
    );
  }

  /**
   * Creates a CompetenceDTO.
   * @param {Competence} comp
   * @returns {CompetenceDTO}
   */
  createCompetenceDTO(comp) {
    return new CompetenceDTO(
      comp.competence_id,
      comp.name,
    );
  }

  /**
 * Creates a JobApplicationDTO.
 * @param {JobApplication} job
 * @returns {JobApplicationDTO}
 */
  createJobApplicationDTO(job) {
    return new JobApplicationDTO(
      job.job_application_id,
      job.person_id,
      job.status
    );
  }

}

module.exports = DAO;
