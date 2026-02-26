const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");
const Person = require("./Person");

/**
 * Sequelize model representing a job application submitted by a person.
 *
 * Maps a person to a job application and tracks its status.
 *
 * @module JobApplication
 * @type {Model}
 *
 * @property {number} job_application_id - Unique ID of the job application (primary key).
 * @property {number} person_id - ID of the person submitting the application.
 *                                   References the `person_id` in the Person model.
 * @property {string} status - Current status of the application (default: "unhandled").
 *
 */
const JobApplication = sequelize.define(
    "job_application",
    {
        job_application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        person_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Person,
                key: "person_id",
            },
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "unhandled"
        },
    },
    {
        timestamps: false,
        tableName: "job_application",
    }
);

module.exports = JobApplication;
