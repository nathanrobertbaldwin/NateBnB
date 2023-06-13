// ================ IMPORTS ================ //

const router = require("express").Router();
const sequelize = require("sequelize");
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// ================ MIDDLEWARE ================ //

// ================ GET ROUTES ================ //

// ----------- Get all Reviews of the Current User ------------ //
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const reviews = await User.findByPk(userId, {
    attributes: [],
    include: {
      model: Review,
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: Spot },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
    },
  });
  res.json(reviews);
});
// ================ DELETE ROUTES ================ //

// ----------- Delete A Review ------------ //

router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) return next(new Error("Remember to write a new Error setup."));
  if (ownerId !== review.userId)
    return next(new Error("Remember to write a new Error setup."));

  await Review.destroy({ where: { id: req.params.reviewId } });

  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
