"use strict";

const AccountApi = require("./AccountApi");

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

loader.addRequestHandler(new AccountApi());

module.exports = loader;
