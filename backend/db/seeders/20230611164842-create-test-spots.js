"use strict";

const { Spot } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 W Madeup St",
        city: "Somewhere",
        state: "PA",
        country: "USA",
        lat: "41°24''12.2 N",
        lng: "2°10''26.5 E",
        name: "Beautiful House",
        description: "This beautiful house is right on the water!",
        price: 123.21,
      },
      {
        ownerId: 2,
        address: "421 Elsewhere St",
        city: "Newtown",
        state: "CA",
        country: "USA",
        lat: "41°24''12.2 N",
        lng: "2°10''26.5 E",
        name: "Ugly House",
        description: "This ugly house is in the slums!",
        price: 13.5,
      },
      {
        ownerId: 3,
        address: "999 N Mansion Ave",
        city: "Glitzytown",
        state: "NJ",
        country: "USA",
        lat: "41°24''12.2 N",
        lng: "2°10''26.5 E",
        name: "Spectacular Place",
        description: "This spectacular place looks right at NYC!",
        price: 500.21,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Spots", {
      address: ["123 W Madeup St", "421 Elsewhere St", "999 N Mansion Ave"],
    });
  },
};
