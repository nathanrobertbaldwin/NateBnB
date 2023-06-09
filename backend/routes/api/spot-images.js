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

// ============================= MIDDLEWARE ============================= //

// =========================== DELETE ROUTES =========================== //

// ------------------------ Delete a Spot Image ------------------------ //

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const imageId = parseInt(req.params.imageId);
  const image = await SpotImage.findByPk(imageId, {
    include: { model: Spot, attributes: ["ownerId"] },
  });

  if (!image)
    return next(new noResourceExistsError("Spot Image couldn't be found"));

  const ownerId = req.user.dataValues.id;
  
  if (ownerId !== image.Spot.ownerId) {
    return next(new AuthorizationError("Forbidden"));
  }

  await SpotImage.destroy({ where: { id: req.params.imageId } });

  return res.json({
    message: "Successfully deleted",
  });
});

// ============================== EXPORTS ============================== //

module.exports = router;
