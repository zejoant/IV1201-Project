const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");
const Person = require("./Person");

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
