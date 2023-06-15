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
          review: "I really like the windows",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 3,
          review: "The carpet is shag green",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 4,
          review: "Could use a deep clean",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 4,
          review: "Toilet was dirty!",
          stars: 1,
        },
        {
          spotId: 4,
          userId: 5,
          review: "This place looks wonderful, but smells weird.",
          stars: 2,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, {
      review: [
        "This place is great!",
        "I really like the windows",
        "The carpet is shag green",
        "Could use a deep clean",
        "Toilet was dirty!",
        "This place looks wonderful, but smells weird.",
      ],
    });
  },
};
