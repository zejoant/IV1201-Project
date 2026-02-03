"use strict";

const RequestHandler = require("./RequestHandler");

/**
 * Defines the REST API with endpoints related to messages.
 */
class LoginApi extends RequestHandler {
  /**
   * Constructs a new instance.
   */
  constructor() {
    super();
  }

  get path() {
    return "/api";
  }

  async registerHandler() {
    try {
      await this.retrieveController();

      this.router.post("/login", async (req, res) => {
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
    } catch (err) {
      console.log("oopsie", err);
    }
  }
}

module.exports = LoginApi;
