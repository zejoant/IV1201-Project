"use strict";

const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const RequestHandler = require("./RequestHandler");
const Authorization = require("./auth/Authorization")

/**
 * API handler for job applications.
 * Extends RequestHandler and provides endpoints for:
 * - Submitting applications
 * - Listing competences
 * - Listing applications
 * - Retrieving a specific application
 * - Updating application status
 *
 * All routes perform input validation and authorization checks.
 *
 * @public
 * @extends RequestHandler
 */
class ApplicationApi extends RequestHandler {
  /**
   * Creates a new ApplicationApi instance.
   * Initializes the request handler via the parent constructor.
   *
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * The base path for this API's routes.
   *
   * @type {string}
   * @returns {string} Base route path.
   */
  get path() {
    return "/application";
  }

  /**
 * Registers all application-related routes on the router:
 * - POST /apply: Submit a new application
 * - GET /list_competences: Retrieve all competences
 * - GET /list_applications: Retrieve all applications
 * - POST /get_application: Retrieve a specific application
 * - PATCH /update_application: Update application status
 *
 * Each route performs validation, authorization, and sends
 * standardized responses via sendResponse.
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If controller initialization fails
 */
  async registerHandler() {
    try {
      await this.getController();

      /*
      *
      * Submits a new job application for the logged-in user.
      *
      * Parameters:
      * - Requires valid authentication cookie (user must be logged in)
      * - expertise: Array of competences, at least one required.
      * - availability: Array of availability periods, at least one required.
      *
      * Returns:
      * - 200: Application submitted successfully.
      * - 400: Validation errors (expertise/availability missing or invalid).
      * - 401: User not authenticated.
      */
      this.router.post("/apply",
        [
          body("expertise").isArray().isLength({ min: 1 }),
          body("availability").isArray().isLength({ min: 1 }),
        ],
        async (req, res, next) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendResponse(res, 400, errors.array())
              return;
            }

            if (!(await Authorization.checkLogin(req, res))) {
              this.sendResponse(res, 401, { errors: errors.array() });
              return;
            }

            const { expertise, availability } = req.body;

            const application = await this.contr.createApplication(expertise, availability, req.user.id);

            if (!application) {
              this.sendResponse(res, 401, { message: "Invalid application" })
              return;
            }

            this.sendResponse(res, 200, { message: "sent application" });
          } catch (err) {
            next(err);
          }
        });
      /*
      *
      * Retrieves all competences available in the system.
      * 
      * Parameters:
      * - Requires valid authentication cookie (user must be logged in)
      *
      * Returns:
      * - 200: Array of competences (CompetenceDTO[]).
      * - 400: Validation errors (should rarely occur for GET).
      * - 401: User not authenticated.
      * - 404: No competences found.
      */
      this.router.get("/list_competences",
        async (req, res, next) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendResponse(res, 400, { errors: errors.array() });
              return;
            }

            if (!(await Authorization.checkLogin(req, res))) {
              this.sendResponse(res, 401, { errors: errors.array() });
              return;
            }

            const competence = await this.contr.getCompetence();

            if (!competence) {
              this.sendResponse(res, 404, { message: "competence not found" });
              return;
            }
            this.sendResponse(res, 200, competence)
          } catch (err) {
            next(err);
          }
        });

      /*
      *
      * Retrieves all submitted applications along with applicant names.
      * 
      * Parameters:
      * - Requires valid authentication cookie (user must be logged in as recruiter)
      *
      * Returns:
      * - 200: Array of applications with names and IDs.
      * - 400: Validation errors.
      * - 401: User not authenticated.
      * - 404: No applications found.
      */
      this.router.get("/list_applications",
        async (req, res, next) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendResponse(res, 400, { errors: errors.array() });
              return;
            }

            if (!(await Authorization.checkRecruiter(this.contr, req, res))) {
              this.sendResponse(res, 401, { errors: errors.array() });
              return;
            }

            const applications = await this.contr.listApplications();

            if (!applications) {
              this.sendResponse(res, 404, { message: "Applications not found" });
              return;
            }
            this.sendResponse(res, 200, applications)
          } catch (err) {
            next(err);
          }
        });
      /*
      *
      * Retrieves details for a specific application.
      *
      * Parameters (in JSON body):
      *  - Requires valid authentication cookie (user must be logged in as recruiter)
      * - job_application_id: Numeric ID of the application.
      * - person_id: Numeric ID of the applicant.
      * - status: Alphanumeric status string.
      * - name: Applicant's first name.
      * - surname: Applicant's last name.
      *
      * Returns:
      * - 200: Application with competences and availability.
      * - 400: Validation errors (missing or invalid fields).
      * - 401: User not authenticated.
      * - 404: Application not found.
      */
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
              this.sendResponse(res, 400, { errors: errors.array() });
              return;
            }

            if (!(await Authorization.checkRecruiter(this.contr, req, res))) {
              this.sendResponse(res, 401, { errors: errors.array() });
              return;
            }

            const application = await this.contr.getApplication(req.body);

            if (!application) {
              this.sendResponse(res, 404, { message: "Application not found" });
              return;
            }
            this.sendResponse(res, 200, application)
          } catch (err) {
            next(err);
          }
        });
      /*
      *
      * Updates the status of a job application.
      *
      * Parameters (in JSON body):
      * - Requires valid authentication cookie (user must be logged in as recruiter)
      * - job_application_id: Numeric ID of the application.
      * - status: New alphanumeric status.
      *
      * Returns:
      * - 200: Application status updated successfully.
      * - 400: Validation errors (missing or invalid fields).
      * - 401: User not authenticated.
      * - 404: Application not found.
      */
      this.router.patch("/update_application",
        [
          body('status').isAlphanumeric(),
          body('job_application_id').isNumeric(),
        ],
        async (req, res, next) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendResponse(res, 400, { errors: errors.array() });
              return;
            }

            if (!(await Authorization.checkRecruiter(this.contr, req, res))) {
              this.sendResponse(res, 401, { errors: errors.array() });
              return;
            }

            const status = await this.contr.updateApplication(req.body);

            if (!status) {
              this.sendResponse(res, 404, { message: "status not found" });
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
