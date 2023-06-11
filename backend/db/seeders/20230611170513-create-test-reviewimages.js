"use strict";

const { ReviewImage } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      [
        { reviewId: 1, url: "www.somewhere.com/images" },
        { reviewId: 2, url: "www.newpics.com/images" },
        { reviewId: 3, url: "www.imagehost.com/images" },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ReviewImages", {
      reviewId: ["1", "2", "3"],
    });
  },
};
