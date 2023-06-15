// ============================== IMPORTS ============================== //

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
const {
  AuthorizationError,
  noResourceExistsError,
} = require("../../utils/errors");

// =========================== DELETE ROUTES =========================== //

// ----------------------- Delete A Review Image ----------------------- //

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const image = await ReviewImage.findByPk(req.params.imageId, {
    include: { model: Review },
  });

  if (!image)
    return next(new noResourceExistsError("Review Image couldn't be found"));

  const userId = req.user.dataValues.id;

  if (userId !== image.Review.userId) {
    return next(new AuthorizationError("Forbidden"));
  }

  await ReviewImage.destroy({ where: { id: req.params.imageId } });
  return res.json({
    message: "Successfully deleted",
  });
});

// ============================== EXPORTS ============================== //

module.exports = router;
