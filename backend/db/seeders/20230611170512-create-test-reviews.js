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
          userId: 2,
          review:
            "This is a beautiful apartment in a lovely area right in central Strasbourg. Spacious and cozy, with a comfortable bed, nice little kitchen, and cozy sitting area. As other reviewers have mentioned, keep in mind that the shower is pretty open and visible, so the apartment is best for an individual or a couple. Definitely highly recommended!",
          stars: 5,
        },
        {
          spotId: 1,
          userId: 3,
          review:
            "Just as described, this is a small and simple apartment in a friendly residential neighborhood very near to Montmartre. The apartment is very small and basic, but it has all the necessities for a few nights for one or two people (bed, mini-fridge, hot shower, hair dryer, etc.) The neighborhood is nice, and easy walking distance to both Montmartre and Opera. We would recommend this apartment to those seeking a good value apartment in Paris!",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 3,
          review:
            "Nice, comfortable, and affordable place to stay. Good location (walking distance to Waikiki, right near many restaurants and coffee shops). The two bedrooms are comfortable and the kitchen is very well-equipped. Sofa bed is a bit small but can fit two people in a pinch. Note that the apartment only comes with one key, but another is available for a larger group if you request in advance. We would stay here again!",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 4,
          review:
            "The host was flexible in changing his time to meet us at the last minute. His apartment was clean and had all of the listed amenities. Note that the apartment is on a small, residential street. It is a very quick and easy walk to downtown, but the street itself is quiet and a bit dark at night. Along the street runs a train, which is a bit noisy, and directly across from the apartment is an outdoor bar, which played loud music late into the night. While we appreciated the host’s flexibility with check-in, we were a bit off-put when he asked us several times for a five star rating at check out. This apartment is convenient for a short stay at its low price.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 4,
          review:
            "Toilet was dirty! I don't know why you would rent a place with a diry toilet. I just think the host was lazy and didn't hire a professional cleaner. Just doesn't make sense to me!",
          stars: 1,
        },
        {
          spotId: 4,
          userId: 5,
          review:
            "This place looks wonderful, but smells weird. The weird smell was coming from the back yard. This place was pretty far out in the country, so I'm guessing it has a well and sceptic tank. The sceptic tank needs to be pumped clean every few years!",
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
