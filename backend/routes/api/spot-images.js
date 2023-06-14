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

// ================ DELETE ROUTES ================ //

// ----------- Delete a Review Image ------------ //

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const image = await SpotImage.findByPk(req.params.imageId, {
    include: { model: Spot, attributes: ["ownerId"] },
  });

  if (!image) return next(new Error("Remember to write a new Error setup."));
  if (ownerId !== image.Spot.ownerId)
    return next(new Error("Remember to write a new Error setup."));

  await SpotImage.destroy({ where: { id: req.params.imageId } });

  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;