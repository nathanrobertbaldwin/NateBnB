"use strict";

const { Model, Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  SpotImage.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      preview: {
        type: DataTypes.BOOLEAN,
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
      modelName: "SpotImage",
    }
  );
  return SpotImage;
};
