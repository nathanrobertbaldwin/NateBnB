"use strict";

const bcrypt = require("bcryptjs");

let options = {};

if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "Users";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.com",
          username: "Demolition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user1@user.com",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user2@user.com",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user3@user.com",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user4@user.com",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password"),
        },
      ],
      { validate: true }
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "Demo-lition",
            "FakeUser1",
            "FakeUser2",
            "FakeUser3",
            "FakeUser4",
          ],
        },
      },
      {}
    );
  },
};
