require('dotenv').config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

const sequelize = require('../integration/db');
const Person = require("../models/Person");
const JobApplication = require("../models/jobApplication");
const CompetenceProfile = require("../models/competenceProfile");
const Availability = require("../models/availability");

async function seed() {
  try {
    console.log("Seeding database...");

    // Drop and recreate tables
    await sequelize.sync({ force: true });
    console.log("Tables synced.");

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
    ]);
    console.log("Persons seeded.");

    await JobApplication.bulkCreate([
      {
        person_id: 2,
        status: "unhandled",
      }
    ]);
    console.log("JobApplication seeded.");

     // --- Create Competence Profile---
    await CompetenceProfile.bulkCreate([
      {
        person_id: 2,
        competence_id: 1,
        years_of_experience: 1.5
      }
    ]);
    console.log("Competence Profile seeded.");

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

// Only run if executed directly
if (require.main === module) {
  seed();
}

module.exports = seed;