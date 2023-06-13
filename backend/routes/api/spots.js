// ================ IMPORTS ================ //

const router = require("express").Router();
const sequelize = require("sequelize");
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// ================ MIDDLEWARE ================ //

// ----------- Spot Input Validator ------------ //

const validateSpot = [
  check("address")
    .exists()
    .withMessage("address must exist.")
    .notEmpty()
    .withMessage("address cannot be empty.")
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("address must be alphanumeric, plus spaces and . character"),
  check("city")
    .exists()
    .withMessage("city must exist.")
    .notEmpty()
    .withMessage("city cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("city must be letters only, plus spaces"),
  check("state")
    .exists()
    .withMessage("state must exist.")
    .notEmpty()
    .withMessage("state cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("city must be letters only, plus spaces"),
  check("country")
    .exists()
    .withMessage("country must exist.")
    .notEmpty()
    .withMessage("country cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("city must be letters only, plus spaces"),
  check("lat")
    .exists()
    .withMessage("lat must exist.")
    .not()
    .isString()
    .withMessage("lat must be a number.")
    .matches(/^[0-9.-]*$/)
    .withMessage("lat must be numeric, plus - character"),
  check("lng")
    .exists()
    .withMessage("lng must exist.")
    .not()
    .isString()
    .withMessage("lng must be a number.")
    .matches(/^[0-9.-]*$/)
    .withMessage("lng must be numeric, plus - character"),
  check("name")
    .exists()
    .withMessage("name must exist.")
    .notEmpty()
    .withMessage("name cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("city must be letters only, plus spaces"),
  check("description")
    .exists()
    .withMessage("description must exist.")
    .notEmpty()
    .withMessage("description cannot be empty."),
  check("price")
    .exists()
    .withMessage("price must exist.")
    .notEmpty()
    .withMessage("price cannot be empty.")
    .not()
    .isString()
    .withMessage("price must be a number.")
    .matches(/^[0-9.]*$/)
    .withMessage("price must be alphanumeric, plus . character"),
  handleValidationErrors,
];

// ================ GET ROUTES ================ //
// ----------- Get All Spots ------------ //

router.get("/", async (req, res, next) => {
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
    // Note to self: postgres requires order statement referencing some
    // column on the joined tables. Seems like this is only an issue when joining
    // multiple tables?
    // Also, for some inexplicable reason, the first table is actually the model name.
    // Because using the Spot.findAll?
  });

  spots = spots.map((spot) => (spot = spot.toJSON()));

  spots.forEach((spot) => {
    spot.aveReview = spot.sumReviews / spot.countReviews;
    delete spot.sumReviews;
    delete spot.countReviews;
    spot.previewImage = spot.SpotImages[0].url;
    delete spot.SpotImages;
  });

  return res.json(spots);
});

// ----------- Get all Spots owned by the Current User ------------ //

router.get("/current", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  let Spots = await Spot.findAll({
    where: { ownerId: ownerId },
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
    // Note to self: postgres requires order statement referencing some
    // column on the joined tables. Seems like this is only an issue when joining
    // multiple tables?
    // Also, for some inexplicable reason, the first table is actually the model name.
    // Because using the Spot.findAll?
  });

  Spots = Spots.map((spot) => (spot = spot.toJSON()));

  Spots.forEach((spot) => {
    spot.aveReview = spot.sumReviews / spot.countReviews;
    delete spot.sumReviews;
    delete spot.countReviews;
    spot.previewImage = spot.SpotImages[0].url;
    delete spot.SpotImages;
  });

  return res.json({ Spots });
});

// ----------- Get details for a Spot from an id ------------ //

router.get("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [{ model: SpotImage }, { model: User }],
  });
  if (!spot) return next(new Error("Remember to write a new Error setup."));
  return res.json(spot);
});

// ----------- Get all Reviews By Spot Id ------------ //

router.get("/:spotId/reviews", async (req, res, next) => {
  const reviewsBySpotId = await Review.findAll();
  return res.json(reviewsBySpotId);
});

// ================ POST ROUTES ================ //
// ----------- Post New Spot ------------ //

router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = Spot.build({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  await newSpot.save();

  return res.json(newSpot);
});

// ----------- Post A New Spot Image ------------ //

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const spot = await Spot.findByPk(req.params.spotId);
  if (ownerId !== spot.ownerId) {
    return next(new Error("Remember to write a new Error setup."));
  }
  const { url, preview } = req.body;
  const newSpotImage = SpotImage.build({ url, preview });
  await newSpotImage.save();
  return res.json(newSpotImage);
});

// ================ PUT ROUTES ================ //

// ----------- Edit A Spot ------------ //

router.put("/:spotId", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return next(new Error("Remember to write a new Error setup."));
  if (ownerId !== spot.ownerId)
    return next(new Error("Remember to write a new Error setup."));

  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  if (address) spot.address = address;
  if (city) spot.city = city;
  if (state) spot.state = state;
  if (country) spot.country = country;
  if (lat) spot.lat = lat;
  if (lng) spot.lng = lng;
  if (name) spot.name = name;
  if (description) spot.description = description;
  if (price) spot.price = price;

  await spot.save();

  return res.json(spot);
});

// ================ DELETE ROUTES ================ //

// ----------- Delete A Spot ------------ //

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return next(new Error("Remember to write a new Error setup."));
  if (ownerId !== spot.ownerId)
    return next(new Error("Remember to write a new Error setup."));

  await Spot.destroy({ where: { id: req.params.spotId } });

  return res.json({
    message: "Successfully deleted",
  });
});

// router.use((err, req, res, next) => {
//   const err = new Error;
//   Error.message =
// });

module.exports = router;
