const { Sequelize } = require("sequelize");
require("dotenv").config({ path: __dirname + "/../.env" });

const useSSL = process.env.DB_SSL === "true";

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions:
      process.env.DB_SSL === "true" //could be set to always look for ssl not conditional
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  },
);

module.exports = sequelize;
