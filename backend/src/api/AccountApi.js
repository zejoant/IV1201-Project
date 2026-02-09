"use strict";

const {body, check, validationResult} = require('express-validator');
const RequestHandler = require("./RequestHandler");
const Authorization = require("./auth/Authorization")

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

          const person = await this.contr.login(username, password);

          if (!person) {
            this.sendResponse(res, 401, {message: "Invalid credentials"})
            return;
          }
          // send cookie 
          Authorization.sendCookie(person, res);
          this.sendResponse(res, 200, {message: "Logged in success"});
        } catch (err) {
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

          const person = await this.contr.createAccount({name, surname, pnr, email, username, password, role_id});

          if (!person) {
            this.sendResponse(res, 401, {message: "Account creation failed"});
            return;
          }
          this.sendResponse(res, 200, {message: "Success!"})
        } catch (err) {
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
          next(err);
        }
      });

    } catch (err) {
      throw err;
    }
  }
}

module.exports = LoginApi;
