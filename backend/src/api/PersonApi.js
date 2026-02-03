"use strict";

const RequestHandler = require("./RequestHandler");

/**
 * Defines the REST API with endpoints related to messages.
 */
class PersonApi extends RequestHandler {
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

      this.router.get("/:id", async (req, res) => {
        try {
          console.log("Fetching user ID:", req.params.id);

          const person = await this.contr.findUserById(req.params.id);

          console.log("Person fetched:", person);

          if (!person) {
            return res.status(404).json({ message: "Person not found" });
          }

          res.json(person);
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

module.exports = PersonApi;
