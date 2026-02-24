"use strict";

const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const RequestHandler = require("./RequestHandler");
const Authorization = require("./auth/Authorization")

/**
 * API handler for user authentication and account management.
 *
 * Extends RequestHandler to provide:
 * - Sign-in endpoint (`/sign_in`) for logging in users.
 * - Sign-up endpoint (`/sign_up`) for creating new accounts.
 * - Endpoint to retrieve the currently logged-in user (`/id`).
 *
 * Each route performs input validation and authorization checks,
 * and sends standardized responses using `sendResponse`.
 *
 * @public
 * @extends RequestHandler
 */
class LoginApi extends RequestHandler {
  /**
  * Creates a new LoginApi instance.
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
 * @returns {string} Base route path for login/account endpoints.
 */
  get path() {
    return "/account";
  }

  /**
  * Registers all login/account-related routes on the router:
  * - POST /sign_in
  * - POST /sign_up
  * - GET /id
  *
  * Each route includes validation, authentication, and uses
  * `sendResponse` to provide consistent JSON responses.
  *
  * @async
  * @returns {Promise<void>}
  * @throws {Error} If controller initialization fails.
  */
  async registerHandler() {
    try {
      await this.getController();

      /*
       *
       * Logs in a user with username and password.
       *
       * Parameters:
       * - Requires valid authentication cookie (user must be logged in).
       * - username: Alphanumeric string, 3–30 characters.
       * - password: String, minimum 8 characters.
       *
       * Returns:
       * - 200: Login successful; sets authentication cookie.
       * - 400: Validation errors (invalid username/password format).
       * - 401: Invalid credentials or authentication failed. / User not authenticated.
       */
      this.router.post("/sign_in",
        [
          body("username").trim().isLength({ min: 3, max: 30 }).withMessage('invalid_username_length').isAlphanumeric().withMessage('invalid_username_chars'),
          body("password").isLength({ min: 8 }).withMessage('invalid_password_length'),
        ],
        async (req, res, next) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendResponse(res, 400, errors.array())
              return;
            }

            const { username, password } = req.body;

            const person = await this.contr.login(username);

            if (!person) {
              this.sendResponse(res, 401, 'invalid_credentials')
              return;
            }

            const match = await bcrypt.compare(password, person.password)

            if (!match) {
              this.sendResponse(res, 401, 'invalid_credentials')
              return;
            }
            // send cookie 
            Authorization.sendCookie(person, res);
            this.sendResponse(res, 200, "Logged in success");
          } catch (err) {
            next(err);
          }
        });

      /*
       *
       * Creates a new user account.
       *
       * 
       * Parameters:
       * - name: Non-empty string.
       * - surname: Non-empty string.
       * - pnr: Numeric personal number.
       * - email: Valid email address.
       * - username: Alphanumeric string.
       * - password: String, minimum 8 characters.
       *
       * Returns:
       * - 200: Account created successfully.
       * - 400: Validation errors (missing or invalid fields).
       * - 401: Account creation failed (e.g., username already exists).
       */
      this.router.post("/sign_up",
        [
          body("username").trim().isLength({ min: 3, max: 30 }).withMessage('invalid_username_length').isAlphanumeric().withMessage('invalid_username_chars'),
          body("name").notEmpty().withMessage('invalid_name').isAlpha().withMessage('invalid_name_letters'),
          body("surname").notEmpty().withMessage('invalid_surname').isAlpha().withMessage('invalid_surname_letters'),
          body("pnr").isNumeric({no_symbols:true}).withMessage('invalid_pnr').isLength({min:12, max:12}).withMessage('invalid_pnr_length'),
          body("email").normalizeEmail().isEmail().withMessage('invalid_email'),
          body("password").isLength({ min: 8 }).withMessage('invalid_password_length'),
        ],
        async (req, res, next) => {
          try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              this.sendResponse(res, 400, errors.array() )
              return;
            }

            const { name, surname, pnr, email, username, password } = req.body;
            const role_id = 2

            const SALT_ROUNDS = 12;
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const person = await this.contr.createAccount({ name, surname, pnr, email, username, password: hashedPassword, role_id });

            if (!person) {
              this.sendResponse(res, 401, "invalid_account_creation");
              return;
            }
            this.sendResponse(res, 200, "Account created!")
          } catch (err) {
            next(err);
          }
        });
      


      this.router.post("/sign_out",
        async (req, res, next) => {
          try {
            Authorization.deleteCookie(res);
            this.sendResponse(res, 200, "success!")
          } catch (err) {
            next(err);
          }
        });

      /*
       *
       * Retrieves information about the currently logged-in user.
       *
       * Parameters:
       * - Requires valid authentication cookie (user must be logged in).
       *
       * Returns:
       * - 201: Returns the Person object for the logged-in user.
       * - 400: Validation errors.
       * - 401: User not authenticated.
       * - 404: User not found in the database.
       */
      this.router.get("/id",
        async (req, res, next) => {
          try {
            if (!(await Authorization.checkLogin(req, res))) {
              return;
            }

            const person = await this.contr.findUserById(req.user.id);

            if (!person) {
              this.sendResponse(res, 404, 'invalid_fetch');
              return;
            }
            this.sendResponse(res, 201, person)
          } catch (err) {
            next(err);
          }
        });

    } catch (err) {
      throw err;
    }
  }
}

module.exports = LoginApi;
