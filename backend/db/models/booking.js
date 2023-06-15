"use strict";

const { Model, Sequelize } = require("sequelize");
const { getCurrentDate, getDateFromString } = require("../../utils/dates");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  Booking.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          afterToday(val) {
            const today = getCurrentDate();
            const bookingStartDate = getDateFromString(val);
            if (bookingStartDate < today)
              throw new Error("Booking start must be after today!");
          },
        },
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          afterStartDate(val) {
            const bookingStartDate = getDateFromString(this.startDate);
            const bookingEndDate = getDateFromString(val);
            if (bookingEndDate < bookingStartDate)
              throw new Error(
                "Booking end date must be after booking start date!"
              );
          },
        },
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
      modelName: "Booking",
    }
  );
  return Booking;
};
