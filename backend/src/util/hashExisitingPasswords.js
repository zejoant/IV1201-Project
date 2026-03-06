"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const Person = require("../models/Person");
const postgresDB = require("../integration/db");

const SALT_ROUNDS = 12;

/**
 * Migrates plaintext passwords in the Person table to hashed passwords using bcrypt.
 *
 * This function performs the following steps:
 * 1. Authenticates with the PostgreSQL database.
 * 2. Fetches all users from the Person table.
 * 3. Iterates over each user:
 *    - Skips users with null passwords.
 *    - Skips users whose passwords are already hashed.
 *    - Hashes plaintext passwords and updates the database.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when all eligible passwords have been hashed.
 * @throws {Error} Throws an error if database connection fails or updates cannot be saved.
 */
async function migratePasswords() {
  try {
    await postgresDB.authenticate();
    console.log("Connected to DB");

    const users = await Person.findAll();

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      const password = user.password;

      // Skip null passwords
      if (!password) {
        console.log(`Skipping user ${user.username} (password is null)`);
        continue;
      }

      // Skip already hashed passwords
      if (password.startsWith("$2")) {
        console.log(`Skipping user ${user.username} (already hashed)`);
        continue;
      }

      // Hash plaintext password
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);

      // Update DB
      user.password = hashed;
      await user.save();

      console.log(`Hashed password for ${user.username}`);
    }

    console.log("Password migration complete");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

/**
 * Execute migration if the script is run directly.
 */
migratePasswords();
