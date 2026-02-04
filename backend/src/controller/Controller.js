"use strict";

const DAO = require("../integration/DAO");

class Controller {
  constructor() {
    this.DAO = new DAO();
  }

  static async makeController() {
    const contr = new Controller();
    await contr.DAO.connectToDatabase();
    return contr;
  }

  async login(username, password) {
    return await this.DAO.findUser(username, password);
  }

  async createAccount({name, surname, pnr, email, username, password, role_id}){
    return await this.DAO.createPerson({name, surname, pnr, email, username, password, role_id})
  }

  async findUserById(id) {
    return await this.DAO.findUserById(id);
  }
}

module.exports = Controller;
