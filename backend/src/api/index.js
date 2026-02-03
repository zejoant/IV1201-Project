"use strict";

const PersonApi = require("./PersonApi");
const LoginApi = require("./LoginApi");

class RequestHandlerLoader {
  constructor() {
    this.reqHandlers = [];
  }

  addRequestHandler(reqHandler) {
    this.reqHandlers.push(reqHandler);
  }

  loadHandlers(app) {
    this.reqHandlers.forEach((reqHandler) => {
      reqHandler.registerHandler();
      app.use(reqHandler.path, reqHandler.router);
    });
  }
}

const loader = new RequestHandlerLoader();

loader.addRequestHandler(new LoginApi());
loader.addRequestHandler(new PersonApi());

module.exports = loader;
