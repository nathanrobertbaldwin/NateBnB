const router = require("express").Router();
const sequelize = require("sequelize");
const { Spot, User, Review, SpotImage } = require("../../db/models");

// COmment

router.get("/current", async (req, res, next) => {
  let spots = await Spot.findAll({
    attributes: {
      include: [
        [sequelize.fn("count", sequelize.col("stars")), "countReviews"],
        [sequelize.fn("sum", sequelize.col("stars")), "sumReviews"],
      ],
    },
    include: [
      { model: Review, attributes: [] },
      { model: SpotImage, attributes: ["url"], where: { preview: true } },
    ],
    group: ["Spot.id", "Reviews.id", "SpotImages.id"],
  });

  spots = spots.map((spot) => (spot = spot.toJSON()));

  spots.forEach((spot) => {
    spot.aveReview = spot.sumReviews / spot.countReviews;
    delete spot.sumReviews;
    delete spot.countReviews;
    spot.previewImage = spot.SpotImages[0].url;
    delete spot.SpotImages;
  });

  res.json(spots);
});

router.use((req, res, next) => {
  const err = Error("Bad request.");
  err.status = 400;
  err.title = "Bad request.";
  res.json(err);
});

module.exports = router;
