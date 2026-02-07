"use strict";

const {body, validationResult} = require('express-validator');
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
          // send cookie 
          Authorization.sendCookie(person, res, 204);
          this.sendResponse(res, 201, {message: "logged in"})
          //console.log(res);
        } catch (err) {
          //next(err);
          console.log(err);
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

      this.router.get("/id", async (req, res) => {
        try {
          console.log(`this is ${JSON.stringify(req.cookies.auth)}`)
          
          if(!(await Authorization.checkLogin(req, res))){
            return;
          }
          
          const person = await this.contr.findUserById(req.user.id);

          console.log("Person fetched:", person);

          if (!person) {
            return res.status(404).json({ message: "Person not found" });
          }

          this.sendResponse(res, 201, person)
        } catch (err) {
          console.error("Sequelize / Backend error:", err);
          res.status(500).json({ error: "Server error", details: err.message });
        }
      });

    } catch (err) {
      console.log("oopsie", err);
    }
  }
}

module.exports = LoginApi;
