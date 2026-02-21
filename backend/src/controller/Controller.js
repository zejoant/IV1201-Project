"use strict";

const DAO = require("../integration/DAO");
const Checker = require("../util/Checkers");

/**
 * Application controller coordinating business logic between
 * routes, DAO, and database transactions.
 *
 * @public
 */
class Controller {

  /**
   * Creates a controller instance and initializes DAO access.
   * @constructor
   */
  constructor() {
    this.DAO = new DAO();
    this.transactionManager = this.DAO.getTransactionManager();
  }

  /**
  * Factory method that creates and initializes a controller
  * with an active database connection.
  *
  * @static
  * @returns {Promise<Controller>} Initialized controller instance.
  */
  static async makeController() {
    const contr = new Controller();
    await contr.DAO.connectToDatabase();
    return contr;
  }

  /**
   * Factory method that creates and initializes a controller
   * with an active database connection.
   *
   * @static
   * @returns {Promise<Controller>} Initialized controller instance.
   */
  async login(username) {
    return this.transactionManager.transaction(async (t1) => {
      Checker.isLength(username, 3, 30, 'username');
      Checker.isAlphaNumeric(username, 'username');
      const user = await this.DAO.findUser(username);
      return user;
    });
  }

  /**
   * Creates a new user account.
   *
   * @param {string} name user name
   * @param {string} surname user surname
   * @param {string} pnr user personnummer
   * @param {string} email user email
   * @param {string} username user username
   * @param {string} password user password
   * @param {number} role_id user role id 
   * @returns {Promise<PersonDTO>} Created user.
   */
  async createAccount({ name, surname, pnr, email, username, password, role_id }) {
    return this.transactionManager.transaction(async (t1) => {
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

      const user = await this.DAO.createPerson({ name, surname, pnr, email, username, password, role_id })
      return user;
    })
  }

  /**Finds user by id by called the DAO
   * @param {int} id: The id of the user
   * @return {PersonAPI} The user found in the DB
  */
  async findUserById(id) {
    return this.transactionManager.transaction(async (t1) => {
      Checker.isPositiveInteger(id, 'person id')
      const user = await this.DAO.findUserById(id);
      return user;
    })
  }

  /**
  * Creates a job application with expertise and availability.
  *
  * @param {Array<Object>} expertise - List of competences.
  * @param {Array<Object>} availability - Availability periods.
  * @param {number} id - Person ID.
  * @returns {Promise<JobApplication>} Created application.
  */
  async createApplication(expertise, availability, id) {
    return this.transactionManager.transaction(async (t1) => {
      Checker.isArray(expertise, 'expertise');
      Checker.isLength(expertise, 1, Number.MAX_SAFE_INTEGER, 'expertise');
      Checker.isArray(availability, 'availability');
      Checker.isLength(availability, 1, Number.MAX_SAFE_INTEGER, 'availability');
      Checker.isPositiveInteger(id, 'id');

      const status = "unhandled";

      const expertiseArray = await Promise.all(expertise.map(exp => this.DAO.addExpertise(id, exp)));
      const availabilityArray = await Promise.all(availability.map(ava => this.DAO.addAvailability(id, ava)));
      const newApplication = await this.DAO.submitApplication(id, status);

      return newApplication;
    })
  }

  /**
   * Retrieves all applications including applicant names.
   *
   * @returns {Promise<Array<JobApplicationDTO>>}
   */
  async listApplications() {
    return this.transactionManager.transaction(async (t1) => {

      const applications = await this.DAO.listApplications();

      const applicationList = await Promise.all(
        applications.map(async (input) => {
          const person = await this.DAO.findUserById((input.person_id))
          Object.assign(input, { name: person.name, surname: person.surname });
          return input
        })
      )
      return applicationList;
    })
  }

  /**
  * Retrieves detailed information for a specific application,
  * including competences and availability.
  *
  * @param {JobApplicationDTO} application - Application data.
  * @returns {Promise<Object>} Application profile.
  */
  async getApplication(application) {
    return this.transactionManager.transaction(async (t1) => {
      Checker.isPositiveInteger(application.job_application_id, 'job app id');
      Checker.isPositiveInteger(application.person_id, 'person id');
      Checker.isMatches(application.status, /^(unhandled|rejected|accepted)$/, 'status');
      Checker.notEmptyString(application.name, 'name');
      Checker.isAlpha(application.name, 'name');
      Checker.notEmptyString(application.surname, 'surname');
      Checker.isAlpha(application.surname, 'surname');

      //const person = await this.DAO.findUserById(application.person_id);  TODO: fråga leif om man borde ha typ mail
      const competenceProfile = await this.DAO.findCompProfileByUserId(application.person_id);
      const ava = await this.DAO.findAvaByUserId(application.person_id);

      const competences = await Promise.all(competenceProfile.map(async (input) => {
        const comp = await this.DAO.findCompByUserId(input.competence_id);
        return { yoe: input.years_of_experience, name: comp.name }
      }))

      const profile = Object.assign(
        application,
        {
          competences,
          availabilities: ava.map((input) => {
            return { to_date: input.to_date, from_date: input.from_date }
          }),
        });
      return profile;
    })
  }

  /**
   * Updates the status of an application.
   *
   * @param {number} body.job_application_id identifier for job application 
   * @param {string} body.status status of the application
   * @returns {Promise<Array<number>>} Number of updated rows.
   */
  async updateApplication(body) {
    return this.transactionManager.transaction(async (t1) => {
      Checker.isMatches(body.status, /^(unhandled|rejected|accepted)$/, 'status' );
      Checker.isPositiveInteger(body.job_application_id, 'job app id');

      const newStatus = await this.DAO.updateApplication(body);

      return newStatus;
    })
  }

  /**
  * Retrieves all available competences.
  *
  * @returns {Promise<CompetenceDTO[]>}
  */
  async getCompetence() {
    return this.transactionManager.transaction(async (t1) => {
      return await this.DAO.getCompetence();
    })
  }
}

module.exports = Controller;
