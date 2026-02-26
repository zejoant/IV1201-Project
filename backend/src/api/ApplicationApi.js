"use strict";

const bcrypt = require("bcrypt");
const {body, validationResult} = require('express-validator');
const RequestHandler = require("./RequestHandler");
const Authorization = require("./auth/Authorization")
const logger = require("../utils/logger");

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
          logger.info(`Attempt to submit application by user: ${req.user.id}`);

          if (!application) {
            this.sendResponse(res, 401, {message: "Invalid application"})
            logger.warn(`Failure to submit application by user: ${req.user.id}`);
            return;
          }

          this.sendResponse(res, 200, {message: "sent application"});
        } catch (err) {
          logger.error(`Error when attempting to submit application by user: ${req.user.id} , error: ${err}`);
          next(err);
        }
      });

      this.router.get("/list_competences",
        async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, {errors: errors.array()});
            return;
          }
          
          const competence = await this.contr.getCompetence();

          if (!competence) {
            this.sendResponse(res, 404, {message: "competence not found" });
            return;
          }
          this.sendResponse(res, 200, competence)
        } catch (err) {
          next(err);
        }
      });

      this.router.get("/list_applications",
        async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, {errors: errors.array()});
            return;
          }
          
          const applications = await this.contr.listApplications();

          if (!applications) {
            this.sendResponse(res, 404, {message: "Applications not found" });
            return;
          }
          this.sendResponse(res, 200, applications)
        } catch (err) {
          next(err);
        }
      });

       this.router.post("/get_application",
        [
          body('job_application_id').isNumeric(),
          body('person_id').isNumeric(),
          body('status').isAlphanumeric(),
          body('name').isAlphanumeric(),
          body('surname').isAlphanumeric(),
        ],
        async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, {errors: errors.array()});
            return;
          }
          
          const application = await this.contr.getApplication(req.body);

          if (!application) {
            this.sendResponse(res, 404, {message: "Application not found" });
            return;
          }
          this.sendResponse(res, 200, application)
        } catch (err) {
          next(err);
        }
      });

      this.router.patch("/update_application",
        [
          body('status').isAlphanumeric(),
          body('job_application_id').isNumeric(),
        ],
        async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, {errors: errors.array()});
            return;
          }
          
          const status = await this.contr.updateApplication(req.body);

          if (!status) {
            this.sendResponse(res, 404, {message: "status not found" });
            return;
          }
          this.sendResponse(res, 200, status)
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
