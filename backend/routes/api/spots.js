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

// ----------- Get All Spots of Current User ------------ //

// router.get("/api/spots/current", async (req, res, next) => {});

// ----------- Get Spot Details By Spot ID ------------ //

router.get("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [{ model: SpotImage }, { model: User }],
  });
  if (!spot) return next(new Error("Specified spot does not exist"));
  return res.json(spot);
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

// router.post("/:spotId/images", async (req, res, next) => {
//   const spot = await Spot.findByPk(req.params.spotId);
//   if (!spot) return next(new Error{"Could not f"});
//   const { url, preview } = req.body;
//   const newImage = SpotImage.build(url, preview);
//   res.json(newImage);
// });

// router.use((err, req, res, next) => {
//   const err = new Error;
//   Error.message =
// });

module.exports = router;