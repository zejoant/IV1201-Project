const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

/**
 * Sequelize model representing a person's availability period.
 *
 * @module Availability
 * @type {Model}
 * 
 * @property {number} availability_id - Unique ID for the availability entry (primary key).
 * @property {number} person_id - ID of the person this availability belongs to.
 * @property {Date} from_date - Start date of the availability period.
 * @property {Date} to_date - End date of the availability period.
 *
 */
const Availability = sequelize.define(
    "availability",
    {
        availability_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        person_id: {
            type: DataTypes.INTEGER,
        },
        from_date: {
            type: DataTypes.DATE,
        },
        to_date: {
            type: DataTypes.DATE,
        },
    },
    {
        timestamps: false,
        tableName: "availability",
    }
);

module.exports = Availability;
