require('dotenv').config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const sequelize = require('../integration/db');
const Person = require("../models/Person");
const JobApplication = require("../models/JobApplication");
const CompetenceProfile = require("../models/CompetenceProfile");
const Availability = require("../models/Availability");

/**
 * Seeds the database with initial test data.
 *
 * This function performs the following steps:
 * 1. Synchronizes the database schema, dropping existing tables.
 * 2. Inserts test data into the `Person` table.
 * 3. Inserts test data into the `JobApplication` table.
 * 4. Inserts test data into the `CompetenceProfile` table.
 * 5. Inserts test data into the `Availability` table.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when seeding is complete.
 * @throws {Error} Throws an error if seeding fails.
 */
async function seed() {
  try {
    console.log("Seeding database...");

    // Drop and recreate tables
    await sequelize.sync({ force: true });
    console.log("Tables synced.");

    /**
     * Seed initial Person data
     * 
     * @type {Array<Object>}
     * @property {string} name - First name of the person
     * @property {string} surname - Surname of the person
     * @property {string} username - Username for login
     * @property {string} pnr - Personal number
     * @property {string} email - Email address
     * @property {string} password - Hashed password
     * @property {number} role_id - Role identifier
     */
    await Person.bulkCreate([
      {
        name: "testPersonA",
        surname: "testPersonA",
        username: "testPersonA",
        pnr: "123456789012",
        email: "testPersonA@test.com",
        password: "$2b$12$iqCorwaWqKYPp5kpGcNrTeSeAxY5n7uRplAFJN2j9dX2ThM74PWSe",
        role_id: 1,
      },
      {
        name: "testPersonB",
        surname: "testPersonB",
        username: "testPersonB",
        pnr: "012345678912",
        email: "testPersonB@test.com",
        password: "$2b$12$iqCorwaWqKYPp5kpGcNrTeSeAxY5n7uRplAFJN2j9dX2ThM74PWSe",
        role_id: 2,
      },
      {
        username: "testPersonC",
        pnr: "012345678912",
        password: "$2b$12$iqCorwaWqKYPp5kpGcNrTeSeAxY5n7uRplAFJN2j9dX2ThM74PWSe",
        role_id: 2,
      },
    ]);
    console.log("Persons seeded.");

    /**
     * Seed initial JobApplication data
     * 
     * @type {Array<Object>}
     * @property {number} person_id - ID of the person applying
     * @property {string} status - Status of the application
     */
    await JobApplication.bulkCreate([
      {
        person_id: 2,
        status: "unhandled",
      }
    ]);
    console.log("JobApplication seeded.");

    /**
     * Seed initial CompetenceProfile data
     * 
     * @type {Array<Object>}
     * @property {number} person_id - ID of the person
     * @property {number} competence_id - ID of the competence
     * @property {number} years_of_experience - Years of experience in this competence
     */
    await CompetenceProfile.bulkCreate([
      {
        person_id: 2,
        competence_id: 1,
        years_of_experience: 1.5
      }
    ]);
    console.log("Competence Profile seeded.");

    /**
     * Seed initial Availability data
     * 
     * @type {Array<Object>}
     * @property {number} person_id - ID of the person
     * @property {string} from_date - Start date of availability (YYYY-MM-DD)
     * @property {string} to_date - End date of availability (YYYY-MM-DD)
     */
    await Availability.bulkCreate([
      {
        person_id: 2,
        from_date: "2026-01-01",
        to_date: "2026-01-02"
      },
    ]);

    console.log("Database seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

/**
 * Only runs the seed function if this file is executed directly.
 */
if (require.main === module) {
  seed();
}

module.exports = seed;