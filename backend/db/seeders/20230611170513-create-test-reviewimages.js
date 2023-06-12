"use strict";

const { ReviewImage } = require("../models");

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "reviewImages";

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(
      options,
      [
        { reviewId: 1, url: "www.somewhere.com/images" },
        { reviewId: 2, url: "www.newpics.com/images" },
        { reviewId: 3, url: "www.imagehost.com/images" },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, {
      reviewId: ["1", "2", "3"],
    });
  },
};
