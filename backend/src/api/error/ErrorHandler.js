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

  /**
   * Sends a standardized HTTP response.
   *
   * If the status code is below 400, wraps the body in { success: ... }.
   * Otherwise, wraps the body in { error: ... }.
   *
   * @param {express.Response} res - Express response object.
   * @param {number} status - HTTP status code.
   * @param {*} body - Response payload.
   * @returns {void}
   */
  sendResponse(res, status, body) {
    if (!body) {
      res.status(status).end();
    }
    else {
      if (status < 400) {
        res.status(status).json({ ["success"]: body });
      }
      else {
        res.status(status).json({ ["error"]: body });
      }
    }
  }
}

module.exports = ErrorHandler;