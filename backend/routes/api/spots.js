// ============================== IMPORTS ============================== //

const router = require("express").Router();
const sequelize = require("sequelize");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const Op = sequelize.Op;
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  AuthorizationError,
  noResourceExistsError,
} = require("../../utils/errors");

// ============================= MIDDLEWARE ============================= //

// -------------------------- Query Validator  -------------------------- //

const validateQueries = [
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("lat must be a floating point number."),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("lat must be a floating point number."),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("lng must be a floating point number."),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("lng must be a floating point number."),
  check("minPrice")
    .optional()
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("address must be alphanumeric, plus spaces and . character"),
  check("maxPrice")
    .optional()
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("address must be alphanumeric, plus spaces and . character"),
  handleValidationErrors,
];

// -------------------------  Spot Input Validator --------------------- //

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
    .isFloat({ min: -90, max: 90 })
    .withMessage("lat must be a floating point number."),
  check("lng")
    .exists()
    .withMessage("lng must exist.")
    .isFloat({ min: -180, max: 180 })
    .withMessage("lng must be a floating point number."),
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
    .isFloat()
    .withMessage("lng must be a floating point number"),
  handleValidationErrors,
];

// ============================= GET ROUTES ============================ //
// --------------------------- Get All Spots --------------------------- //

router.get("/", validateQueries, async (req, res, next) => {
  // Pagination

  const pagination = {};

  let { page, size } = req.query;

  page = parseInt(page);
  size = parseInt(size);

  if (!page) page = 1;
  if (!size) size = 10;

  if (size >= 1 && page >= 1) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }

  // Parameters

  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  const query = { where: {} };

  if (minLat) query.where.lat = { [Op.gte]: minLat };
  if (maxLat) query.where.lat = { [Op.lte]: maxLat };
  if (minLng) query.where.lng = { [Op.gte]: minLng };
  if (maxLng) query.where.lng = { [Op.lte]: maxLng };
  if (minPrice) query.where.price = { [Op.gte]: minPrice };
  if (maxPrice) query.where.price = { [Op.lte]: maxPrice };

  // Query

  let spots = await Spot.findAll({
    ...query,
    include: [
      { model: SpotImage, attributes: ["url"], where: { preview: true } },
      { model: Review },
    ],
    ...pagination,
  });

  // Post Query Mods

  spots = spots.map((spot) => spot.toJSON());

  spots.forEach((spot) => {
    spot.url = spot.SpotImages[0].url;
    delete spot.SpotImages;

    let sum = 0;
    spot.Reviews.forEach((review) => {
      sum += review.stars;
    });

    spot.aveReview = sum / spot.Reviews.length;

    delete spot.Reviews;
  });

  return res.json({ Spots: spots, page, size });
});

// ------------- Get all Spots owned by the Current User -------------- //

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

// ---------------- Get details for a Spot from an id ----------------- //

router.get("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [{ model: SpotImage }, { model: User }],
  });

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  return res.json(spot);
});

// -------------------- Get all Reviews By Spot Id -------------------- //

router.get("/:spotId/reviews", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    attributes: [],
    include: [
      {
        model: Review,
        include: [
          { model: User, attributes: ["id", "firstName", "lastName"] },
          { model: ReviewImage, attributes: ["id", "url"] },
        ],
      },
    ],
  });

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  return res.json(spot);
});

// -------- Get all Bookings for a Spot based on the Spot's id -------- //

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  let spot = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
    include: {
      model: Booking,
      include: { model: User, attributes: ["id", "firstName", "lastName"] },
    },
  });

  spot = spot.toJSON();

  if (userId !== spot.ownerId) {
    spot.Bookings.forEach((booking) => {
      delete booking.id;
      delete booking.userId;
      delete booking.createdAt;
      delete booking.updatedAt;
      delete booking.User;
    });
  }

  delete spot.ownerId;

  return res.json(spot);
});

// ============================= POST ROUTES =========================== //

// ---------------------------- Post New Spot -------------------------- //

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

// ----------- Add an Image to a Spot based on the Spot's id ----------- //

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const ownerId = req.user.dataValues.id;

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));
  if (ownerId !== spot.ownerId) {
    return next(new AuthorizationError("Forbidden"));
  }

  const { url, preview } = req.body;
  const newSpotImage = SpotImage.build({ url, preview });

  await newSpotImage.save();

  return res.json(newSpotImage);
});

// --------- Create a Review for a Spot based on the Spot's id --------- //

router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  const userId = req.user.dataValues.id;
  const spotId = parseInt(req.params.spotId);
  const { review, stars } = req.body;
  const newReview = Review.build({ userId, spotId, review, stars });

  await newReview.save();

  res.json(newReview);
});

// ------- Create a Booking from a Spot based on the Spot's id --------- //

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));
  if (userId === spot.ownerId) {
    return next(new AuthorizationError("Forbidden"));
  }

  const { startDate, endDate } = req.body;
  const newBooking = Booking.build({ spotId, userId, startDate, endDate });

  await newBooking.save();

  res.json(newBooking);
});

// =========================== PUT ROUTES ============================= //

// -------------------------- Edit a Spot ----------------------------- //

router.put("/:spotId", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));
  if (ownerId !== spot.ownerId) {
    return next(new AuthorizationError("Forbidden"));
  }

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

// =========================== DELETE ROUTES =========================== //

// -------------------------- Delete a Booking ------------------------- //

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));
  if (ownerId !== spot.ownerId) {
    return next(new AuthorizationError("Forbidden"));
  }

  await Spot.destroy({ where: { id: req.params.spotId } });

  return res.json({
    message: "Successfully deleted",
  });
});

// ============================== EXPORTS ============================== //

module.exports = router;
