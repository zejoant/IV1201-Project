const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

/**
 * Sequelize model representing a competence or skill in the system.
 *
 * @module Competence
 * @type {Model}
 *
 * @property {number} competence_id - Unique ID of the competence (primary key).
 * @property {string} name - Name of the competence or skill.
 *
 */
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
