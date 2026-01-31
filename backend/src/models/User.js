const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", 
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
  },
  {
    timestamps: false, //disable createdAt & updatedAt
  }
);

module.exports = User;
