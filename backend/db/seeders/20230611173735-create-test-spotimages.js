"use strict";

const { SpotImage } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        { spotId: 1, url: "www.somewhereHost.com/images", preview: true },
        { spotId: 2, url: "www.elsewhereImages.com/images", preview: true },
        { spotId: 3, url: "www.testDomain.com/images", preview: true },
        { spotId: 4, url: "www.imagefiles.com/images", preview: true },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("SpotImages", { spotId: [1, 2, 3, 4] });
  },
};
