"use strict";

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "Reviews";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
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
          userId: 3,
          review: "This place is Okay!",
          stars: 3,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, { spotId: [1] });
  },
};
