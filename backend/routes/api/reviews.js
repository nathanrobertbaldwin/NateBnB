// ================ IMPORTS ================ //

const router = require("express").Router();
const sequelize = require("sequelize");
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// ================ MIDDLEWARE ================ //

// ================ GET ROUTES ================ //

router.get("/reviews/current", requireAuth, async (req, res, next) => {
  
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
