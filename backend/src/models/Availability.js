const { DataTypes } = require("sequelize");
const sequelize = require("../integration/db");

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
