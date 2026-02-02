const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");
const Person = require("./Person");

const JobApplication = sequelize.define(
    "job_application",
    {
        application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        person_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
