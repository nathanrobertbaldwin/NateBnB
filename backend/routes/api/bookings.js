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

// ================ MIDDLEWARE ================ //

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

module.exports = router;
