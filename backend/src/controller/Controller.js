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
    return await this.DAO.login(username, password);
  }

  async findUserById(id) {
    return await this.DAO.findUserById(id);
  }
}

module.exports = Controller;
