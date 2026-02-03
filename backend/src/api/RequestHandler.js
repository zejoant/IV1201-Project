"use strict";

const express = require("express");
const Controller = require("../controller/Controller");

class RequestHandler {
  constructor() {
    this.router = express.Router();
  }

  async retrieveController() {
    this.contr = await Controller.makeController();
  }
}

module.exports = RequestHandler;
