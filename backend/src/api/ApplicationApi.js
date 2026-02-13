"use strict";

const bcrypt = require("bcrypt");
const {body, validationResult} = require('express-validator');
const RequestHandler = require("./RequestHandler");
const Authorization = require("./auth/Authorization")

class ApplicationApi extends RequestHandler {
  constructor() {
    super();
  }

  get path() {
    return "/application";
  }

  async registerHandler() {
    try {
      await this.getController();

      this.router.post("/apply", 
      [
        body("expertise").isArray().isLength({min: 1}),
        body("availability").isArray().isLength({min: 1}),
      ],
      async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, errors.array())
            return;
          }

          if(!(await Authorization.checkLogin(req, res))){
            this.sendResponse(res, 401, {errors: errors.array()});
            return;
          }
          
          const {expertise, availability} = req.body;

          const application = await this.contr.createApplication(expertise, availability, req.user.id);

          if (!application) {
            this.sendResponse(res, 401, {message: "Invalid application"})
            return;
          }

          this.sendResponse(res, 200, {message: "sent application"});
        } catch (err) {
          next(err);
        }
      });



    } catch (err) {
      throw err;
    }
  }
}

module.exports = ApplicationApi;
