"use strict";

const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });

      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Spot.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [
            [
              "AL",
              "AK",
              "AZ",
              "AR",
              "CA",
              "CZ",
              "CO",
              "CT",
              "DE",
              "DC",
              "FL",
              "GA",
              "GU",
              "HI",
              "ID",
              "IL",
              "IN",
              "IA",
              "KS",
              "KY",
              "LA",
              "ME",
              "MD",
              "MA",
              "MI",
              "MN",
              "MS",
              "MO",
              "MT",
              "NE",
              "NV",
              "NH",
              "NJ",
              "NM",
              "NY",
              "NC",
              "ND",
              "OH",
              "OK",
              "OR",
              "PA",
              "PR",
              "RI",
              "SC",
              "SD",
              "TN",
              "TX",
              "UT",
              "VT",
              "VI",
              "VA",
              "WA",
              "WI",
              "WY",
            ],
          ],
          msg: "Please enter a valid two-letter State.",
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
          min: -90,
          max: 90,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
