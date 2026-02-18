"use strict";

const AccountApi = require("./AccountApi");
const ApplicationApi = require("./ApplicationApi");
const ErrorResponseSender = require("./error/ErrorResponseSender");

/**
 * Loader responsible for registering request and error handlers
 * and attaching them to the Express application.
 *
 * @public
 */
class RequestHandlerLoader {
   /**
   * Creates a new handler loader.
   * Initializes collections for request and error handlers.
   *
   * @constructor
   */
  constructor() {
    this.reqHandlers = [];
    this.errorHandlers = [];
  }

  /**
   * Adds a request handler to be registered.
   *
   * @param {RequestHandler} reqHandler - Request handler instance.
   * @returns {void}
   */
  addRequestHandler(reqHandler) {
    this.reqHandlers.push(reqHandler);
  }

  /**
   * Adds an error handler to be registered.
   *
   * @param {Object} errorHandler - Error handler instance.
   * @returns {void}
   */
  addErrorHandler(errorHandler){
    this.errorHandlers.push(errorHandler);
  }

    /**
   * Registers all error handlers on the Express application.
   *
   * @param {express.Application} app - Express application instance.
   * @returns {void}
   */
  loadErrorHandlers(app){
    this.errorHandlers.forEach((errorHandler)=>{
      errorHandler.registerHandler(app);
    });
  }

    /**
   * Registers all request handlers and mounts their routers
   * on the Express application.
   *
   * @param {express.Application} app - Express application instance.
   * @returns {void}
   */
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
