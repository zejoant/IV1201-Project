"use strict";

const DAO = require("../integration/DAO");

//The Controller interacts with the model and integration layers
class Controller {

  //creates a new DAO instance
  constructor() {
    this.DAO = new DAO();
    this.transactionManager = this.DAO.getTransactionManager();
  }

  //creates and returns a controller
  static async makeController() {
    const contr = new Controller();
    await contr.DAO.connectToDatabase();
    return contr;
  }

  //login user by called the DAO
  async login(username) {
    return this.transactionManager.transaction(async (t1) => {
      const user = await this.DAO.findUser(username);
      //if(user.length === 0){
      //  return null;
      //}
      return user;
     });
  }

  //create new user by called the DAO
  async createAccount({name, surname, pnr, email, username, password, role_id}){
    return this.transactionManager.transaction(async (t1) => {
      const user = await this.DAO.createPerson({name, surname, pnr, email, username, password, role_id})
      //if(user.length == 0){
      //  return null;
      //}
      return user;
    })
  }

  /**Finds user by id by called the DAO
   * @param {int} id: The id of the user
   * @return {PersonAPI} The user found in the DB
  */
  async findUserById(id) {
    return this.transactionManager.transaction(async (t1) => {
      const user = await this.DAO.findUserById(id);
      //if(user.length == 0){
      //  return null;
      //}
      return user;
    })
  }

  async createApplication(expertise, availability, id){
    return this.transactionManager.transaction(async (t1) => {
      
      var expertiseArray = [];
      var availabilityArray = [];
      const status = "unhandled";

      expertise.forEach(async (exp) => {
        expertiseArray.push(await this.DAO.addExpertise(id, exp));
      });

      availability.forEach(async (ava) => {
        availabilityArray.push(await this.DAO.addAvailability(id, ava));
      });

      const newApplication = await this.DAO.submitApplication(id, status);

      return newApplication;
    })
  }

  async listApplications(){
    return this.transactionManager.transaction(async (t1) => {

      const applications = await this.DAO.listApplications();

      const applicationList = await Promise.all(
        applications.map(async (input) => {
          const person = await this.DAO.findUserById((input.person_id))
          Object.assign(input,{name:person.name, surname:person.surname});
          return input
        })
      )
      return applicationList;
    })
  }

  async getApplication(application){
    return this.transactionManager.transaction(async (t1) => {
    
      //const person = await this.DAO.findUserById(application.person_id);  TODO: fråga leif om man borde ha typ mail
      const competenceProfile = await this.DAO.findCompProfileByUserId(application.person_id);
      const ava = await this.DAO.findAvaByUserId(application.person_id); 

      const competences = await Promise.all(competenceProfile.map(async(input) => {  
        const comp = await this.DAO.findCompByUserId(input.competence_id);
        return {yoe: input.years_of_experience, name: comp.name}
      }))

      const profile = Object.assign(
        application,
        {
        competences,
        availabilities:ava.map((input) => {
          return {to_date:input.to_date, from_date:input.from_date}
        }),
      });
      return profile;
    })
  }

  async getCompetence(){
    return this.transactionManager.transaction(async (t1) => {
      return await this.DAO.getCompetence();
    })
  }
}

module.exports = Controller;
