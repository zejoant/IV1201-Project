"use strict";

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
      await this.retrieveController();

      this.router.post("/sign_in", async (req, res) => {
        try {
          const { username, password } = req.body;

          if (!username || !password) {
            return res
              .status(400)
              .json({ message: "Missing username or password" });
          }

          const person = await this.contr.login(username, password);

          if (!person) {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          // For now, just return user info (no JWT/session yet)
          res.json({
            person_id: person.person_id,
            name: person.name,
            surname: person.surname,
            username: person.username,
          });
        } catch (err) {
          console.error("Login error:", err);
          res.status(500).json({ message: "Server error" });
        }
      });

      this.router.post("/sign_up", async (req, res) => {
        try {
          const {name, surname, pnr, email, username, password} = req.body;
          const role_id = 2

          if (!name || !surname || !pnr || !email ||!username|| !password) {
            return res
              .status(400)
              .json({ message: "Missing information" });
          }

          const person = await this.contr.createAccount({name, surname, pnr, email, username, password, role_id});

          if (!person) {
            return res.status(401).json({message: "Account creation failed"});
          }

          res.json({
            name: person.name,
            surname: person.surname,
            pnr: person.pnr,
            email: person.email,
            username: person.username,
          });

        } catch (err) {
          console.error("Login error:", err);
          res.status(500).json({ message: "Server error" });
        }
      });

    } catch (err) {
      console.log("oopsie", err);
    }
  }
}

module.exports = LoginApi;
