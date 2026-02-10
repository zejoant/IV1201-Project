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
  async login(username, password) {
    return this.transactionManager.transaction(async (t1) => {
      const user = await this.DAO.findUser(username, password);
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
      const user = await this.DAO.findUserByPk(id);
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
}

module.exports = Controller;
