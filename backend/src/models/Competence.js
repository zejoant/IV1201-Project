const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

const Competence = sequelize.define(
    "competence",
    {
        competence_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
        tableName: "competence",
    }
);

module.exports = Competence;
