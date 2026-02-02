const { DataTypes } = require("sequelize");
const sequelize = require("../db");

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
    tableName: "person",
    timestamps: false, //disable createdAt & updatedAt
  },
);

module.exports = Person;
