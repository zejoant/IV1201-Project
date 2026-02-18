'use strict'

const Controller = require("../../controller/Controller");

/**
 * Base error handler class.
 *
 * Provides utility methods for sending standardized JSON responses
 * and initializing a controller instance for use in error handling.
 *
 * @public
 */
class ErrorHandler {

  /**
   * Creates a new ErrorHandler instance.
   *
   * @constructor
   */
  constructor() { }

  /**
   * Initializes and assigns a Controller instance.
   *
   * @async
   * @returns {Promise<void>}
   */
  async retrieveController() {
    this.contr = await Controller.makeController();
  }
}

module.exports = ErrorHandler;