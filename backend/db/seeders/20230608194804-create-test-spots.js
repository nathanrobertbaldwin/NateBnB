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
          state: "Idaho",
          country: "United States of America",
          lat: 40.0,
          lng: 170.25,
          name: "Beautiful House",
          description:
            "From the outside this house looks very elegant. It has been built with red bricks and has white stone decorations. Tall, half rounded windows allow enough light to enter the home and have been added to the house in a very symmetric way. The house is equipped with an old-fashioned kitchen and one small bathroom, it also has a huge living room, five bedrooms, a large dining area and a spacious garage. The building is shaped like an L. The extension extends into a garden path circling around half the house. The second floor is smaller than the first, which allowed for a roof garden on one side of the house. This floor has roughly the same style as the floor below.The roof is high and v-shaped and is covered with grey ceramic tiles. There are no chimneys. Several small windows let in just enough light to the rooms below the roof. The house itself is surrounded by a modest garden, with mostly grass, a few flower patches and a children''s playground.",
          price: 123.21,
        },
        {
          ownerId: 1,
          address: "421 Elsewhere St",
          city: "Newtown",
          state: "Oregon",
          country: "United States of America",
          lat: -40.51,
          lng: 170.99,
          name: "Ugly House",
          description:
            "From the outside this house looks nice and traditional. It has been built with wheat colored bricks and has grey stone decorations. Small, rounded windows brighten up the house and have been added to the house in a very symmetric way. The house is equipped with a large kitchen and one modern bathroom, it also has a warm living room, four bedrooms, a grand dining area, a playroom and a spacious garage. The building is square shaped. The house is fully surrounded by cloth sunscreens.The second floor is the same size as the first, which has been built exactly on top of the floor below it. This floor has a very different style than the floor below. The roof is low, triangular and layered and is covered with wood shingles. Two large chimneys poke out the center of the roof. Several large windows let in plenty of light to the rooms below the roof. The house itself is surrounded by a gorgeous garden, including various trees, bushes, flowers and a large pond.",
          price: 13.5,
        },
        {
          ownerId: 2,
          address: "999 N Mansion Ave",
          city: "Glitzytown",
          state: "Texas",
          country: "United States of America",
          lat: 0,
          lng: 0,
          name: "Spectacular Place",
          description:
            "From the outside this house looks snug and comfortable. It has been built with oak wood and has sandstone decorations. Small, rectangular windows add to the overall look of the house and have been added to the house in a very asymmetric way. The house is equipped with an average kitchen and one modern bathroom, it also has a cozy living room, four bedrooms, a roomy dining area and a spacious storage room. The building is shaped like an L. The extension extends into a garden path circling around half the house. The second floor is the same size as the first, which has been built exactly on top of the floor below it. This floor follows the same style as the floor below. The roof is low and triangular and is covered with dark ceramic tiles. Two small chimneys poke out the center of the roof. Two roof terraces let in plenty of light to the rooms below the roof. The house itself is surrounded by a gorgeous garden, including various trees, bushes, flowers and a large pond.",
          price: 500.21,
        },
        {
          ownerId: 3,
          address: "2185 Messed Up St",
          city: "Badtown",
          state: "New York",
          country: "United States of America",
          lat: 42,
          lng: -60,
          name: "Awful Home",
          description:
            "From the outside this house looks old, but wonderful. It has been built with wheat colored bricks and has blue stone decorations. Short, wide windows allow enough light to enter the home and have been added to the house in a mostly symmetric way. The house is equipped with a modern kitchen and one modern bathroom, it also has a comfortable living room, two bedrooms, a cozy dining area, a bar and a small basement. The building is shaped like a short U. The two extensions are linked by cloth sunscreens. The second floor is the same size as the first, but part of it hangs over the edge of the floor below, creating an overhang on one side and a balcony on the other. This floor has a slightly different style than the floor below. The roof is high, triangular and layered and is covered with black roof tiles. Two large chimneys sit at either side of the house. Several long, thin windows let in plenty of light to the rooms below the roof. The house itself is surrounded by a tranquil garden, with various flowers, a long pond including a small waterfall and various rock formations.",
          price: 50.0,
        },
        {
          ownerId: 4,
          address: "9876 Highway A",
          city: "Dells",
          state: "Iowa",
          country: "United States of America",
          lat: 45,
          lng: 100,
          name: "The Dells House",
          description:
            "From the outside this house looks warm and cozy. It has been built with bricks covered in render and has white cedar wooden decorations. Small, half rounded windows brighten up the house and have been added to the house in a very symmetric way.The house is equipped with an average kitchen and three bathrooms, it also has a large living room, three bedrooms, a spacious dining room and a snug storage room. The building is shaped like a short U. The two extensions are linked by overgrown wooden overhanging panels. The second floor is the same size as the first, which has been built exactly on top of the floor below it. This floor has a different style than the floor below. The roof is flat and is covered with wheat straw. Two small chimneys sit at either side of the house. Several long, thin windows let in plenty of light to the rooms below the roof. The house itself is surrounded by a gorgeous garden, including hanging grape vines, a pagoda, a pond and many different flowers.",
          price: 999.0,
        },
        {
          ownerId: 5,
          address: "654 Icky Spot Rd",
          city: "Ickyton",
          state: "Georgia",
          country: "United States of America",
          lat: 0,
          lng: 0,
          name: "Icky Spot Place",
          description:
            "From the outside this house looks magnificent. It has been built with red pine wood and has fir wooden decorations. Large, octagon windows add to the overall style of the house and have been added to the house in a fairly symmetrical pattern. The house is equipped with a modern kitchen and one modern bathroom, it also has a huge living room, four bedrooms, a grand dining area and a snug storage room. The building is fairly rounded in shape. The house is partially surrounded by a garden path on two sides. The second floor is the same size as the first, but part of it hangs over the edge of the floor below, creating an overhang on one side and a balcony on the other. This floor has a very different style than the floor below. The roof is low and square shaped and is covered with black roof tiles. Two small chimneys poke out the center of the roof. A few large windows let in just enough light to the rooms below the roof. The house itself is surrounded by a modest garden, with mostly grass, a few flower patches and a children's playground.",
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
