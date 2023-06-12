"use strict";

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "Bookings";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      options,
      [
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
          userId: 1,
          startDate: "2023-06-11",
          endDate: "2023-06-12",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, { spotId: ["1", "2", "3"] });
  },
};
