"use strict";

const {body, validationResult} = require('express-validator');
const RequestHandler = require("./RequestHandler");

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
      async (req, res) => {
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
          // For now, just return user info (JWT not done yet)
          res.status(201).json({
            person_id: person.person_id,
            name: person.name,
            surname: person.surname,
            username: person.username,
            email: person.email,
          });
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
        async (req, res) => {
        try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({errors: errors.array()});
            return;
          }

          const {name, surname, pnr, email, username, password} = req.body;
          const role_id = 2

          const person = await this.contr.createAccount({name, surname, pnr, email, username, password, role_id});

          if (!person) {
            res.status(401).json({message: "Account creation failed"});
            return;
          }

          res.status(201).json({message: "Success!",});
        } catch (err) {
          next(err);
        }
      });

    } catch (err) {
      console.log("oopsie", err);
    }
  }
}

module.exports = LoginApi;
