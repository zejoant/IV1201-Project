"use strict";

const express = require("express");
const Controller = require("../controller/Controller");

/**
 * Base request handler responsible for routing setup
 * and standardized HTTP responses.
 *
 * @public
 */
class RequestHandler {
  /**
  * Creates a new request handler and initializes an Express router.
  * @constructor
  */
  constructor() {
    this.router = express.Router();
  }

  /**
  * Initializes and assigns a controller instance.
  *
  * @returns {Promise<void>}
  */
  async getController() {
    this.contr = await Controller.makeController();
  }

  /**
   * Sends a standardized HTTP response.
   *
   * Successful responses are wrapped in { success: ... }
   * and error responses in { error: ... }.
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
        if(Array.isArray(body)){
          body = body[0].msg;
        }
        console.log(body)
        res.status(status).json({ ["error"]: body });
      }
    }
  }
}

module.exports = RequestHandler;
