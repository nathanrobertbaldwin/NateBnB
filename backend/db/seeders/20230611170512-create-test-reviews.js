"use strict";

const { Review } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 2,
          review: "This place is great!",
          stars: 5,
        },
        {
          spotId: 1,
          userId: 2,
          review: "This place is sucks!",
          stars: 4,
        },
        {
          spotId: 1,
          userId: 2,
          review: "This place is Okay!",
          stars: 3,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reviews", { spotId: [1] });
  },
};
