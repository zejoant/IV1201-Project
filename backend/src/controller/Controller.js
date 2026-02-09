"use strict";

const DAO = require("../integration/DAO");

//The Controller interacts with the model and integration layers
class Controller {

  //creates a new DAO instance
  constructor() {
    this.DAO = new DAO();
  }

  //creates and returns a controller
  static async makeController() {
    const contr = new Controller();
    await contr.DAO.connectToDatabase();
    return contr;
  }

  //login user by called the DAO
  async login(username) {
    return await this.DAO.findUser(username);
  }

  //create new user by called the DAO
  async createAccount({name, surname, pnr, email, username, password, role_id}){
    return await this.DAO.createPerson({name, surname, pnr, email, username, password, role_id})
  }

  /**Finds user by id by called the DAO
   * @param {int} id: The id of the user
   * @return {PersonAPI} The user found in the DB
  */
  async findUserById(id) {
    return await this.DAO.findUserById(id);
  }
}

module.exports = Controller;
