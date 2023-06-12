"use strict";

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "SpotImages";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      options,
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
    await queryInterface.bulkDelete(options, { spotId: [1, 2, 3, 4] });
  },
};
