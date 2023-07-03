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
  userAlreadyReviewedError,
} = require("../../utils/errors");
const { getCurrentDate, getDateFromString } = require("../../utils/dates");

// ============================= MIDDLEWARE ============================= //

// --------- Validation for Optional Queries to Get All Spots ----------- //

const validateGetAllSpotOptionalQueries = [
  check("minLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("MinLat must be a floating point number between -90 and 90."),
  check("maxLat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("MaxLat must be a floating point number between -90 and 90."),
  check("minLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage(
      "MinLng must be a floating point number between -180 and 180."
    ),
  check("maxLng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage(
      "MaxLng must be a floating point number between -180 and 180."
    ),
  check("minPrice")
    .optional()
    .isFloat()
    .withMessage("MinPrice must be a floating point number."),
  check("maxPrice")
    .optional()
    .isFloat()
    .withMessage("MaxPrice must be a floating point number."),
  handleValidationErrors,
];

// --------------------- Validator for Post New Spot -------------------- //

const validatePostNewSpot = [
  check("address")
    .exists()
    .withMessage("Address must exist.")
    .notEmpty()
    .withMessage("Address cannot be empty.")
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("Address must be alphanumeric, plus spaces and . character"),
  check("city")
    .exists()
    .withMessage("City must exist.")
    .notEmpty()
    .withMessage("City cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("City must be letters only, plus spaces"),
  check("state")
    .exists()
    .withMessage("State must exist.")
    .notEmpty()
    .withMessage("State cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Please enter a valid two-letter State."),
  check("country")
    .exists()
    .withMessage("Country must exist.")
    .notEmpty()
    .withMessage("Country cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Country must be letters only, plus spaces"),
  check("lat")
    .exists()
    .withMessage("Lat must exist.")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Lat must be a floating point number beween -90 and 90."),
  check("lng")
    .exists()
    .withMessage("Lng must exist.")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Lng must be a floating point number between -180 and 180."),
  check("name")
    .exists()
    .withMessage("Name must exist.")
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Name must be letters only, plus spaces")
    .custom((value, { req }) => {
      return value.length < 50;
    })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists()
    .withMessage("Description must exist.")
    .notEmpty()
    .withMessage("Description cannot be empty.")
    .isString()
    .withMessage("Description must be a string."),
  check("price")
    .exists()
    .withMessage("Price must exist.")
    .notEmpty()
    .withMessage("Price cannot be empty.")
    .isFloat()
    .withMessage("Price must be a floating point number"),
  handleValidationErrors,
];

// ---------------- Validator for Post New Spot Image ------------------ //

const validatePostNewSpotImage = [
  check("url")
    .exists()
    .withMessage("Url must exist")
    .isURL()
    .withMessage("Url string must be a URL"),
  check("preview")
    .exists()
    .withMessage("Preview must exist")
    .isBoolean()
    .withMessage("Preview must be a boolean"),
  handleValidationErrors,
];

// ------------ Validator for Create a Review With Spot Id ------------- //

const validatePostNewReview = [
  check("review").exists().isString().withMessage("Review text is required"),
  check("stars")
    .optional()
    .isNumeric({ min: 0, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// ---------- Validator for Create New Booking with Spot Id ----------- //

const validateNewBooking = [
  check("startDate")
    .exists()
    .withMessage("StartDate must exist.")
    .isString()
    .withMessage("StartDate must be a string")
    .custom((value, { req }) => {
      const today = getCurrentDate();
      const bookingStartDate = getDateFromString(req.body.startDate);
      return today < bookingStartDate;
    })
    .withMessage("StartDate must be after today.")
    .custom(async (value, { req }) => {
      const spotId = parseInt(req.params.spotId);
      const bookingsList = await Spot.findByPk(spotId, {
        attributes: [],
        include: {
          model: Booking,
          attributes: ["startDate", "endDate"],
        },
      });

      const { startDate, endDate } = req.body;
      let noConflicts = true;

      bookingsList.Bookings.forEach((booking) => {
        let existingBookingStartDate = getDateFromString(booking.startDate);
        let existingBookingEndDate = getDateFromString(booking.endDate);
        let newBookingStartDate = getDateFromString(startDate);
        let newBookingEndDate = getDateFromString(endDate);

        if (
          existingBookingStartDate <= newBookingStartDate &&
          newBookingStartDate <= existingBookingEndDate
        )
          noConflicts = false;

        if (
          newBookingStartDate <= existingBookingStartDate &&
          existingBookingEndDate <= newBookingEndDate
        )
          noConflicts = false;
      });

      if (noConflicts === false) return Promise.reject();
    })
    .withMessage("StartDate conflicts with an existing booking"),
  check("endDate")
    .exists()
    .withMessage("EndDate must exist.")
    .isString()
    .withMessage("EndDate must be a string")
    .custom((value, { req }) => {
      const bookingEndDate = getDateFromString(req.body.endDate);
      const bookingStartDate = getDateFromString(req.body.startDate);
      return bookingStartDate < bookingEndDate;
    })
    .withMessage("EndDate must be after startDate.")
    .custom(async (value, { req }) => {
      const spotId = parseInt(req.params.spotId);
      const bookingsList = await Spot.findByPk(spotId, {
        attributes: [],
        include: {
          model: Booking,
          attributes: ["startDate", "endDate"],
        },
      });

      const { startDate, endDate } = req.body;
      let noConflicts = true;

      bookingsList.Bookings.forEach((booking) => {
        let existingBookingStartDate = getDateFromString(booking.startDate);
        let existingBookingEndDate = getDateFromString(booking.endDate);
        let newBookingStartDate = getDateFromString(startDate);
        let newBookingEndDate = getDateFromString(endDate);

        if (
          existingBookingStartDate <= newBookingEndDate &&
          newBookingEndDate <= existingBookingEndDate
        )
          noConflicts = false;

        if (
          newBookingStartDate <= existingBookingStartDate &&
          existingBookingEndDate <= newBookingEndDate
        )
          noConflicts = false;
      });

      if (noConflicts === false) return Promise.reject();
    })
    .withMessage("EndDate conflicts with an existing booking"),
  handleValidationErrors,
];

// ------------------ Validator for Edit a Spot ------------------- //

const validatePutEditASpot = [
  check("address")
    .optional()
    .notEmpty()
    .withMessage("Address cannot be empty.")
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("Address must be alphanumeric, plus spaces and . character"),
  check("city")
    .optional()
    .notEmpty()
    .withMessage("City cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("City must be letters only, plus spaces"),
  check("state")
    .optional()
    .notEmpty()
    .withMessage("State cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("State must be a valid two-letter state."),
  check("country")
    .optional()
    .notEmpty()
    .withMessage("Country cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Country must be letters only, plus spaces"),
  check("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Lat must be a floating point number."),
  check("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Lng must be a floating point number."),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .matches(/^[a-zA-Z ]*$/)
    .withMessage("Name must be letters only, plus spaces"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty.")
    .isString()
    .withMessage("Description must be a string."),
  check("price")
    .optional()
    .notEmpty()
    .withMessage("Price cannot be empty.")
    .isFloat()
    .withMessage("Price must be a floating point number"),
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

    spot.avgStarRating =
      spot.Reviews.reduce((accum, review) => {
        return accum + review.stars;
      }, 0) / spot.Reviews.length;
    delete spot.Reviews;

    delete spot.Reviews;
  });

  return res.json({ Spots: spots, page, size });
});

// ------------- Get all Spots owned by the Current User -------------- //

router.get("/current", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  let Spots = await Spot.findAll({
    where: { ownerId: ownerId },
    include: [
      {
        model: SpotImage,
        where: { preview: true },
      },
      {
        model: Review,
        attributes: ["id", "stars"],
      },
    ],
  });

  Spots = Spots.map((spot) => (spot = spot.toJSON()));

  Spots.forEach((spot) => {
    spot.previewImage = spot.SpotImages[0].url;
    delete spot.SpotImages;
    spot.avgStarRating =
      spot.Reviews.reduce((accum, review) => {
        return accum + review.stars;
      }, 0) / spot.Reviews.length;
    delete spot.Reviews;
  });

  return res.json({ Spots });
});

// ---------------- Get details for a Spot from an id ----------------- //

router.get("/:spotId", async (req, res, next) => {
  const spotId = parseInt(req.params.spotId);

  let spot = await Spot.findByPk(spotId, {
    include: [
      { model: User },
      {
        model: SpotImage,
        attributes: { exclude: ["spotId", "createdAt", "updatedAt"] },
      },
      {
        model: Review,
        include: [{ model: User }],
      },
    ],
  });

  if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

  spot = spot.toJSON();

  spot.avgStarRating =
    spot.Reviews.reduce((accum, review) => {
      return accum + review.stars;
    }, 0) / spot.Reviews.length;
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

// ---------------------- Testing Route for custom --------------------- //

// router.get("/:spotId/testing", requireAuth, async (req, res, next) => {
//   const spotId = parseInt(req.params.spotId);
//   const bookingsList = await Spot.findByPk(spotId, {
//     attributes: [],
//     include: {
//       model: Booking,
//       attributes: ["startDate"],
//     },
//   });

//   const { startDate } = req.body;
//   let noConflicts = true;

//   bookingsList.Bookings.forEach((booking) => {
//     if (getDateFromString(booking.startDate) === getDateFromString(startDate)) {
//       noConflicts = false;
//     }
//   });

//   res.json(noConflicts);
// });
// ============================= POST ROUTES =========================== //

// ---------------------------- Post New Spot -------------------------- //

router.post("/", requireAuth, validatePostNewSpot, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;

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
    previewImage,
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
  } = req.body;

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

  const newSpotId = newSpot.id;

  const newPreviewImage = SpotImage.build({
    spotId: newSpotId,
    url: previewImage,
    preview: true,
  });

  newPreviewImage.save();

  const newSpotImagesUrls = [];

  if (imageOne) newSpotImagesUrls.push(imageOne);
  if (imageTwo) newSpotImagesUrls.push(imageTwo);
  if (imageThree) newSpotImagesUrls.push(imageThree);
  if (imageFour) newSpotImagesUrls.push(imageFour);

  const newSpotsImages = newSpotImagesUrls.map((url) => {
    return {
      spotId: newSpotId,
      url: url,
      preview: false,
    };
  });

  await SpotImage.bulkCreate(newSpotsImages);

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
    const spot = await Spot.findByPk(spotId, { include: { model: Review } });

    if (!spot) return next(new noResourceExistsError("Spot couldn't be found"));

    const userId = req.user.dataValues.id;

    spot.Reviews.forEach((review) => {
      if (userId === review.userId)
        throw new userAlreadyReviewedError(
          "User already has a review for this spot"
        );
    });

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
  validateNewBooking,
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
