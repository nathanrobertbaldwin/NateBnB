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
          startDate: "2023-06-10",
          endDate: "2023-06-20",
        },
        {
          spotId: 1,
          userId: 3,
          startDate: "2023-06-20",
          endDate: "2023-06-30",
        },
        {
          spotId: 1,
          userId: 4,
          startDate: "2023-06-15",
          endDate: "2023-06-16",
        },
        {
          spotId: 2,
          userId: 3,
          startDate: "2023-06-17",
          endDate: "2023-06-18",
        },
        {
          spotId: 2,
          userId: 4,
          startDate: "2023-06-19",
          endDate: "2023-06-20",
        },
        {
          spotId: 3,
          userId: 4,
          startDate: "2023-06-21",
          endDate: "2023-06-23",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, {
      spotId: ["1", "2", "3", "4", "5", "6"],
    });
  },
};
