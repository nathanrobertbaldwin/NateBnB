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
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  AuthorizationError,
  noResourceExistsError,
} = require("../../utils/errors");
const { getCurrentDate, getDateFromString } = require("../../utils/dates");

// ============================= MIDDLEWARE ============================= //

// ----------------------- Validator for Edit a Booking  ----------------------- //

const validateBookingEdit = [
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
    .withMessage("Start date must be after today.")
    .custom(async (value, { req }) => {
      const bookingId = parseInt(req.params.bookingId);
      const bookingsList = await Booking.findByPk(bookingId, {
        include: {
          model: Spot,
          attributes: ["id"],
          include: {
            model: Booking,
            attributes: ["startDate", "endDate"],
            where: {
              id: {
                [sequelize.Op.not]: bookingId,
              },
            },
          },
        },
      });

      const { startDate, endDate } = req.body;
      let noConflicts = true;

      bookingsList.Spot.Bookings.forEach((booking) => {
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
    .withMessage("Start date conflicts with an existing booking"),
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
    .withMessage("Start date must be before end date.")
    .custom(async (value, { req }) => {
      const bookingId = parseInt(req.params.bookingId);
      const bookingsList = await Booking.findByPk(bookingId, {
        include: {
          model: Spot,
          attributes: ["id"],
          include: {
            model: Booking,
            attributes: ["startDate", "endDate"],
            where: {
              id: {
                [sequelize.Op.not]: bookingId,
              },
            },
          },
        },
      });

      const { startDate, endDate } = req.body;
      let noConflicts = true;

      bookingsList.Spot.Bookings.forEach((booking) => {
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
    .withMessage("End date conflicts with an existing booking"),
  handleValidationErrors,
];

// ============================= GET ROUTES ============================ //

// --------------- Get all of the Current User's Bookings -------------- //

router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const bookings = await User.findByPk(userId, {
    attributes: [],
    include: [
      {
        model: Booking,
        include: {
          model: Spot,
          attributes: { exclude: ["description", "createdAt", "updatedAt"] },
        },
      },
    ],
  });

  return res.json(bookings);
});

// ---------------------- Testing Route for custom --------------------- //

router.post("/:bookingId/testing", requireAuth, async (req, res, next) => {
  const bookingId = parseInt(req.params.bookingId);
  const bookingsList = await Booking.findByPk(bookingId, {
    include: {
      model: Spot,
      attributes: ["id"],
      include: {
        model: Booking,
        attributes: ["id", "startDate", "endDate"],
        where: {
          id: {
            [sequelize.Op.not]: bookingId,
          },
        },
      },
    },
  });

  // const { startDate, endDate } = req.body;
  // let noConflicts = true;

  // bookingsList.Spot.Bookings.forEach((booking) => {
  //   console.log(booking.startDate, booking.endDate);
  //   let existingBookingStartDate = getDateFromString(booking.startDate);
  //   let existingBookingEndDate = getDateFromString(booking.endDate);
  //   let newBookingStartDate = getDateFromString(startDate);
  //   let newBookingEndDate = getDateFromString(endDate);

  //   if (
  //     existingBookingStartDate <= newBookingStartDate &&
  //     newBookingStartDate <= existingBookingEndDate
  //   )
  //     noConflicts = false;

  //   if (
  //     newBookingStartDate <= existingBookingStartDate &&
  //     existingBookingEndDate <= newBookingEndDate
  //   )
  //     noConflicts = false;
  // });

  res.json(bookingsList);

  // if (noConflicts === false) return Promise.reject();
});

// ============================ PUT ROUTES ============================ //

// ------------------------ Edit a Booking ---------------------------- //

router.put(
  "/:bookingId",
  requireAuth,
  validateBookingEdit,
  async (req, res, next) => {
    const bookingId = parseInt(req.params.bookingId);
    const booking = await Booking.findByPk(bookingId);

    if (!booking)
      return next(new noResourceExistsError("Booking couldn't be found"));

    const userId = req.user.dataValues.id;

    if (userId !== booking.userId) {
      return next(new AuthorizationError("Forbidden"));
    }

    const { startDate, endDate } = req.body;

    if (startDate) booking.startDate = startDate;
    if (endDate) booking.endDate = endDate;
    booking.updatedAt = new Date();

    await booking.save();

    res.json(booking);
  }
);

// =========================== DELETE ROUTES =========================== //

// -------------------------- Delete a Booking ------------------------- //

router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = await Booking.findByPk(bookingId, {
    include: { model: Spot, attributes: ["ownerId"] },
  });

  if (!booking)
    return next(new noResourceExistsError("Booking couldn't be found"));

  const today = getCurrentDate();
  const bookingStartDate = getDateFromString(booking.startDate);

  if (bookingStartDate < today) {
    return next(
      new AuthorizationError("Bookings that have been started can't be deleted")
    );
  }

  const userId = req.user.dataValues.id;

  if (userId !== booking.userId && userId !== booking.Spot.ownerId) {
    return next(new AuthorizationError("Forbidden"));
  }

  await Booking.destroy({ where: { id: req.params.bookingId } });

  return res.json({
    message: "Successfully deleted",
  });
});

// ============================== EXPORTS ============================== //

module.exports = router;
