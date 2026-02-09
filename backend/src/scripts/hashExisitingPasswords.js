"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
const Person = require("../src/models/Person");
const postgresDB = require("../src/integration/db");

const SALT_ROUNDS = 12;

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

migratePasswords();
