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
          lat: 40.0,
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
          ownerId: 2,
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
        {
          ownerId: 3,
          address: "2185 Messed Up St",
          city: "Badtown",
          state: "PA",
          country: "USA",
          lat: 42,
          lng: -60,
          name: "Awful Home",
          description: "Just a terrible place to visit",
          price: 50.0,
        },
        {
          ownerId: 4,
          address: "9876 Highway A",
          city: "Dells",
          state: "WI",
          country: "USA",
          lat: 45,
          lng: 100,
          name: "The Dells House",
          description: "Coolest Spot in the Dells!",
          price: 999.0,
        },
        {
          ownerId: 5,
          address: "654 Icky Spot Rd",
          city: "Ickyton",
          state: "FL",
          country: "USA",
          lat: 0,
          lng: 0,
          name: "Icky Spot Place",
          description: "Pretty icky spot somewhere in FL.",
          price: 500.21,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, {
      address: [
        "123 W Madeup St",
        "421 Elsewhere St",
        "999 N Mansion Ave",
        "2185 Messed Up St",
        "9876 Highway A",
        "654 Icky Spot Rd",
      ],
    });
  },
};
