const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

/**
 * Sequelize model representing a person's competence profile.
 *
 * Maps a person to a competence/skill along with their years of experience.
 *
 * @module CompetenceProfile
 * @type {Model}
 *
 * @property {number} competence_profile_id - Unique ID of the competence profile entry (primary key).
 * @property {number} person_id - ID of the person this profile belongs to.
 * @property {number} competence_id - ID of the associated competence/skill.
 * @property {number} years_of_experience - Years of experience the person has in the competence.
 *
 */
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
