const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

const CompetenceProfile = sequelize.define(
    "competence_profile",
    {
        competence_profile_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        person_id: {
            type: DataTypes.INTEGER,
        },
        competence_id: {
            type: DataTypes.INTEGER,
        },
        years_of_experience: {
            type: DataTypes.DECIMAL(4,2),
        },
    },
    {
        timestamps: false,
        tableName: "competence_profile",
    }
);

module.exports = CompetenceProfile;
