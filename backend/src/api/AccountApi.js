"use strict";

const bcrypt = require("bcrypt");
const {body, validationResult} = require('express-validator');
const RequestHandler = require("./RequestHandler");
const Authorization = require("./auth/Authorization")
const logger = require("../utils/logger");

class LoginApi extends RequestHandler {
  constructor() {
    super();
  }

  get path() {
    return "/account";
  }

  async registerHandler() {
    try {
      await this.getController();

      this.router.post("/sign_in", 
      [
        body("username").trim().isLength({min: 3, max: 30}).isAlphanumeric(),
        body("password").isLength({min: 8}),
      ],
      async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, errors.array())
            return;
          }
          
          const { username, password } = req.body;

          logger.info(`Login attempt for username=${username}`);

          const person = await this.contr.login(username);

          if (!person) {
            this.sendResponse(res, 401, {message: "Invalid credentials"})
            logger.warn(`Failed login attempt for username=${username}`);
            return;
          }

          const match = await bcrypt.compare(password, person.password)

          if (!match) {
            this.sendResponse(res, 401, {message: "Invalid credentials"})
            logger.warn(`Failed login attempt for userId=${person.person_id}`);
            return;
          }
          // send cookie 
          Authorization.sendCookie(person, res);
          logger.info(`Login attempt for userId=${person.person_id}`);
          this.sendResponse(res, 200, {message: "Logged in success"});
        } catch (err) {
          logger.error(`Login error: ${err.message}`);
          next(err);
        }
      });

      this.router.post("/sign_up", 
        [
          body("name").notEmpty(),
          body("surname").notEmpty(),
          body("pnr").isNumeric(),
          body("email").normalizeEmail().isEmail(),
          body("username").isAlphanumeric(),
          body("password").isLength({min: 8}),
        ],
        async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, {errors: errors.array()})
            return;
          }

          const {name, surname, pnr, email, username, password} = req.body;
          const role_id = 2

          const SALT_ROUNDS = 12;
          const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

          logger.info(`Attempt to create new account: username=${username}, email=${email}`);
          const person = await this.contr.createAccount({name, surname, pnr, email, username, password: hashedPassword, role_id});

          if (!person) {
            logger.warn(`Account creation failed: username=${username}, email=${email}`)
            this.sendResponse(res, 401, {message: "Account creation failed"});
            return;
          }
          this.sendResponse(res, 200, {message: "Success!"})
          logger.info(`Created new account: username=${username}, name=${name}, surname=${surname} email=${email}`);
        } catch (err) {
          logger.error(`Account creation error: ${err.message}`);
          next(err);
        }
      });

      this.router.get("/id",
        async (req, res, next) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            this.sendResponse(res, 400, {errors: errors.array()});
            return;
          }
          if(!(await Authorization.checkLogin(req, res))){
            this.sendResponse(res, 401, {errors: errors.array()});
            return;
          }
          
          const person = await this.contr.findUserById(req.user.id);
          
          if (!person) {
            this.sendResponse(res, 404, {message: "Person not found" });
            return;
          }
          this.sendResponse(res, 201, person)
        } catch (err) {
          logger.error(`Get id error: ${err.message}`);
          next(err);
        }
      });

    } catch (err) {
      throw err;
    }
  }
}

module.exports = LoginApi;
