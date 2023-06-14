// ================ IMPORTS ================ //

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

// ================ MIDDLEWARE ================ //

const validateBooking = [
  check("startDate")
    .exists()
    .withMessage("startDate must exist.")
    .isString()
    .withMessage("startDate must be a string")
    .custom(({ req }) => {
      const today = getCurrentDate();
      const bookingStartDate = getDateFromString(req.body.startDate);
      return today < bookingStartDate;
    }),
  check("endDate")
    .exists()
    .withMessage("startDate must exist.")
    .isString()
    .withMessage("endDate must be a string"),
  handleValidationErrors,
];

// ================ GET ROUTES ================ //
// ----------- Get all of the Current User's Bookings ------------ //

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

// ================ PUT ROUTES ================ //
// ----------- Edit a Booking ------------ //

router.put(
  "/:bookingId",
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    const userId = req.user.dataValues.id;
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking)
      return next(new noResourceExistsError("Booking couldn't be found"));
    if (userId !== booking.userId) {
      return next(new AuthorizationError("Forbidden"));
    }

    const { startDate, endDate } = req.body;

    if (startDate) booking.startDate = startDate;
    if (endDate) booking.endDate = endDate;

    await booking.save();

    res.json(booking);
  }
);

// ================ DELETE ROUTES ================ //
// ----------- Delete a Booking ------------ //

router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking)
    return next(new noResourceExistsError("Booking couldn't be found"));
  if (userId !== booking.userId) {
    return next(new AuthorizationError("Forbidden"));
  }

  await Booking.destroy({ where: { id: req.params.bookingId } });

  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
