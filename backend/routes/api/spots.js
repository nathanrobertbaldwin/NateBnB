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
const { getCurrentDate, getDateFromString } = require("../../utils/dates");

// ============================= MIDDLEWARE ============================= //

// --------- Validation for Optional Queries to Get All Spots ----------- //

const validateGetAllSpotOptionalQueries = [
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("minLat must be a floating point number between -90 and 90."),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("maxLat must be a floating point number between -90 and 90."),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage(
      "minLng must be a floating point number between -180 and 180."
    ),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage(
      "maxLng must be a floating point number between -180 and 180."
    ),
  check("minPrice")
    .optional()
    .isFloat()
    .withMessage("minPrice must be a floating point number."),
  check("maxPrice")
    .optional()
    .isFloat()
    .withMessage("maxPrice must be a floating point number."),
  handleValidationErrors,
];

// --------------------- Validator for Post New Spot -------------------- //

const validatePostNewSpot = [
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
    .withMessage("state must be letters only, plus spaces"),
  check("country")
    .exists()
    .withMessage("country must exist.")
    .notEmpty()
    .withMessage("country cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("country must be letters only, plus spaces"),
  check("lat")
    .exists()
    .withMessage("lat must exist.")
    .isFloat({ min: -90, max: 90 })
    .withMessage("lat must be a floating point number beween -90 and 90."),
  check("lng")
    .exists()
    .withMessage("lng must exist.")
    .isFloat({ min: -180, max: 180 })
    .withMessage("lng must be a floating point number between -180 and 180."),
  check("name")
    .exists()
    .withMessage("name must exist.")
    .notEmpty()
    .withMessage("name cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("name must be letters only, plus spaces")
    .custom((value, { req }) => {
      return value.length < 50;
    })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists()
    .withMessage("description must exist.")
    .notEmpty()
    .withMessage("description cannot be empty.")
    .isString()
    .withMessage("description must be a string."),
  check("price")
    .exists()
    .withMessage("price must exist.")
    .notEmpty()
    .withMessage("price cannot be empty.")
    .isFloat()
    .withMessage("price must be a floating point number"),
  handleValidationErrors,
];

// ---------------- Validator for Post New Spot Image ------------------ //

const validatePostNewSpotImage = [
  check("url")
    .exists()
    .withMessage("url must exist")
    .isURL()
    .withMessage("url string must be a URL"),
  check("preview")
    .exists()
    .withMessage("preview must exist")
    .isBoolean()
    .withMessage("preview must be a boolean"),
  handleValidationErrors,
];

// ------------ Validator for Create a Review With Spot Id ------------- //

const validatePostNewReview = [
  check("review").optional().isString().withMessage("review must be a string"),
  check("stars").optional().isNumeric({ min: 0, max: 5 }),
  handleValidationErrors,
];

// ---------- Validator for Create New Booking with Spot Id ----------- //

const validatePostNewBooking = [
  check("startDate")
    .exists()
    .withMessage("startDate must exist.")
    .isString()
    .withMessage("startDate must be a string")
    .custom((value, { req }) => {
      const today = getCurrentDate();
      const bookingStartDate = getDateFromString(req.body.startDate);
      return today < bookingStartDate;
    })
    .withMessage("Start date must be after today."),
  check("endDate")
    .exists()
    .withMessage("startDate must exist.")
    .isString()
    .withMessage("endDate must be a string")
    .custom((value, { req }) => {
      const bookingEndDate = getDateFromString(req.body.endDate);
      const bookingStartDate = getDateFromString(req.body.startDate);
      return bookingStartDate < bookingEndDate;
    })
    .withMessage("Start date must be before end date."),
  handleValidationErrors,
];

const validatePutEditASpot = [
  check("address")
    .optional()
    .notEmpty()
    .withMessage("address cannot be empty.")
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("address must be alphanumeric, plus spaces and . character"),
  check("city")
    .optional()
    .notEmpty()
    .withMessage("city cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("city must be letters only, plus spaces"),
  check("state")
    .optional()
    .notEmpty()
    .withMessage("state cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("state must be letters only, plus spaces"),
  check("country")
    .optional()
    .notEmpty()
    .withMessage("country cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("country must be letters only, plus spaces"),
  check("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("lat must be a floating point number."),
  check("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("lng must be a floating point number."),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("name cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("name must be letters only, plus spaces"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("description cannot be empty.")
    .isString()
    .withMessage("description must be a string."),
  check("price")
    .optional()
    .notEmpty()
    .withMessage("price cannot be empty.")
    .isFloat()
    .withMessage("price must be a floating point number"),
  handleValidationErrors,
];

// ============================= GET ROUTES ============================ //
// --------------------------- Get All Spots --------------------------- //

router.get("/", validateGetAllSpotOptionalQueries, async (req, res, next) => {
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
    spot.previewImage = spot.SpotImages[0].url;
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
  const spotId = parseInt(req.params.spotId);

  let spot = await Spot.findByPk(spotId, {
    attributes: {
      include: [
        [sequelize.fn("count", sequelize.col("stars")), "numReviews"],
        [sequelize.fn("sum", sequelize.col("stars")), "sumReviews"],
      ],
    },
    include: [
      { model: SpotImage },
      { model: User },
      { model: Review, attributes: [] },
    ],
    group: ["Spot.id", "SpotImages.id", "User.id"],
  });

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  spot = spot.toJSON();

  spot.avgStarRating = spot.sumReviews / spot.numReviews;
  delete spot.sumReviews;
  spot.Owner = spot.User;
  delete spot.Owner.username;
  delete spot.User;

  return res.json(spot);
});

// -------------------- Get all Reviews By Spot Id -------------------- //

router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId, {
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
  const spotId = parseInt(req.params.spotId);

  let spot = await Spot.findByPk(spotId, {
    attributes: ["ownerId"],
    include: {
      model: Booking,
      include: { model: User, attributes: ["id", "firstName", "lastName"] },
    },
  });

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  spot = spot.toJSON();

  const userId = req.user.dataValues.id;

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

router.post("/", requireAuth, validatePostNewSpot, async (req, res, next) => {
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

router.post(
  "/:spotId/images",
  requireAuth,
  validatePostNewSpotImage,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);
    const ownerId = req.user.dataValues.id;

    if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));
    if (ownerId !== spot.ownerId) {
      return next(new AuthorizationError("Forbidden"));
    }

    const { url, preview } = req.body;
    const newSpotImage = SpotImage.build({ spotId, url, preview });

    await newSpotImage.save();

    return res.json({
      id: newSpotImage.id,
      url: newSpotImage.url,
      preview: newSpotImage.preview,
    });
  }
);

// --------- Create a Review for a Spot based on the Spot's id --------- //

router.post(
  "/:spotId/reviews",
  requireAuth,
  validatePostNewReview,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

    const userId = req.user.dataValues.id;
    const { review, stars } = req.body;
    const newReview = Review.build({ userId, spotId, review, stars });

    await newReview.save();

    res.json(newReview);
  }
);

// ------- Create a Booking from a Spot based on the Spot's id --------- //

router.post(
  "/:spotId/bookings",
  requireAuth,
  validatePostNewBooking,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

    const userId = req.user.dataValues.id;

    if (userId === spot.ownerId) {
      return next(new AuthorizationError("Forbidden"));
    }

    const { startDate, endDate } = req.body;
    const newBooking = Booking.build({ spotId, userId, startDate, endDate });

    await newBooking.save();

    res.json(newBooking);
  }
);

// =========================== PUT ROUTES ============================= //

// -------------------------- Edit a Spot ----------------------------- //

router.put(
  "/:spotId",
  requireAuth,
  validatePutEditASpot,
  async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

    const ownerId = req.user.dataValues.id;

    if (ownerId !== spot.ownerId) {
      return next(new AuthorizationError("Forbidden"));
    }

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    if (address) spot.address = address;
    if (city) spot.city = city;
    if (state) spot.state = state;
    if (country) spot.country = country;
    if (lat) spot.lat = lat;
    if (lng) spot.lng = lng;
    if (name) spot.name = name;
    if (description) spot.description = description;
    if (price) spot.price = price;

    spot.updatedAt = new Date();

    await spot.save();

    return res.json(spot);
  }
);

// =========================== DELETE ROUTES =========================== //

// -------------------------- Delete a Booking ------------------------- //

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(spotId);

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  const ownerId = req.user.dataValues.id;

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
