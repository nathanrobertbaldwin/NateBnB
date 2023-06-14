"use strict";

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "Spots";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 W Madeup St",
          city: "Somewhere",
          state: "PA",
          country: "USA",
          lat: 40.00,
          lng: 170.25,
          name: "Beautiful House",
          description: "This beautiful house is right on the water!",
          price: 123.21,
        },
        {
          ownerId: 1,
          address: "421 Elsewhere St",
          city: "Newtown",
          state: "CA",
          country: "USA",
          lat: -40.51,
          lng: 170.99,
          name: "Ugly House",
          description: "This ugly house is in the slums!",
          price: 13.5,
        },
        {
          ownerId: 4,
          address: "999 N Mansion Ave",
          city: "Glitzytown",
          state: "NJ",
          country: "USA",
          lat: 0,
          lng: 0,
          name: "Spectacular Place",
          description: "This spectacular place looks right at NYC!",
          price: 500.21,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, {
      address: ["123 W Madeup St", "421 Elsewhere St", "999 N Mansion Ave"],
    });
  },
};
