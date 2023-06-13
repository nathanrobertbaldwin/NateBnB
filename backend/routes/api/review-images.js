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
// ----------- Delete A Review Image ------------ //

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const image = await ReviewImage.findByPk(req.params.imageId, {
    include: { model: Review },
  });
  if (!image) return next(new Error("Remember to write a new Error setup."));
  if (userId !== image.Review.userId)
    return next(new Error("Remember to write a new Error setup."));
  await ReviewImage.destroy({ where: { id: req.params.imageId } });
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
