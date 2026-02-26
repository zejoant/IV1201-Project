const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

/**
 * Sequelize model representing a person (user) in the system.
 *
 * Stores personal information, login credentials, and role.
 *
 * @module Person
 * @type {Model}
 *
 * @property {number} person_id - Unique ID of the person (primary key).
 * @property {string} name - First name of the person.
 * @property {string} surname - Last name of the person.
 * @property {string} pnr - Personal number / identifier.
 * @property {string} email - Email address of the person.
 * @property {string} password - Hashed password for authentication.
 * @property {number} role_id - Role type of the user (e.g., admin, regular user).
 * @property {string} username - Unique username for login.
 *
 */
const Person = sequelize.define(
  "person",
  {
    person_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    pnr: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role_id: { type: DataTypes.INTEGER },
    username: { type: DataTypes.STRING },
  },
  {
    timestamps: false, //disable createdAt & updatedAt
    tableName: "person",
  },
);

module.exports = Person;
