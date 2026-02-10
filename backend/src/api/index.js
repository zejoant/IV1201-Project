"use strict";

const AccountApi = require("./AccountApi");
const ApplicationApi = require("./ApplicationApi");
const ErrorResponseSender = require("./error/ErrorResponseSender");

class RequestHandlerLoader {
  constructor() {
    this.reqHandlers = [];
    this.errorHandlers = [];
  }

  addRequestHandler(reqHandler) {
    this.reqHandlers.push(reqHandler);
  }

  addErrorHandler(errorHandler){
    this.errorHandlers.push(errorHandler);
  }

  loadErrorHandlers(app){
    this.errorHandlers.forEach((errorHandler)=>{
      errorHandler.registerHandler(app);
    });
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
loader.addRequestHandler(new ApplicationApi());
loader.addErrorHandler(new ErrorResponseSender());

module.exports = loader;
