const { Sequelize } = require("sequelize");
require("dotenv").config({ path: __dirname + "/../../.env" });
const cls = require('cls-hooked');

const useSSL = process.env.DB_SSL === "true";

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

/**
 * Sequelize instance configured for the PostgreSQL database.
 *
 * Configuration is loaded from environment variables via dotenv.
 *
 * @module database/sequelize
 * @exports sequelize
 * @type {Sequelize}
 */

const namespace = cls.createNamespace('db');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: process.env.DB_SSL === "true" ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  }
);

module.exports = sequelize;
