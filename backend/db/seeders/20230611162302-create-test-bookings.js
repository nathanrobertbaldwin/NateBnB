"use strict";

const { Booking } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: "2023-06-11",
        endDate: "2023-06-12",
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2023-06-11",
        endDate: "2023-06-12",
      },
      {
        spotId: 3,
        userId: 4,
        startDate: "2023-06-11",
        endDate: "2023-06-12",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete("Bookings", { spotId: ["1", "2", "3"] });
  },
};
