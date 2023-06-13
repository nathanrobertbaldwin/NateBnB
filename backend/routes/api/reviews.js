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
  const reviews = await User.findAll({
    where: { id: userId },
    attributes: [],
    include: {
      model: Review,
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: Spot },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
      group: ["User.id", "Spots.id", "ReviewImage.id"],
    },
  });
  res.json(reviews);
});

// ================ POST ROUTES ================ //
// ----------- Add an Image to a Review based on the Review's id ------------ //

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const ownerId = req.user.dataValues.id;
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) return next(new Error("Remember to write a new Error setup."));
  if (ownerId !== review.userId)
    return next(new Error("Remember to write a new Error setup."));
  const { url } = req.body;
  const reviewId = req.params.reviewId;
  const newReviewImage = await ReviewImage.build({ url, reviewId });
  await newReviewImage.save();
  res.json(newReviewImage);
});

// ================ PUT ROUTES ================ //
// ----------- Edit A Review ------------ //

router.put("/:reviewId", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  const reviewById = await Review.findByPk(req.params.reviewId);
  if (!reviewById)
    return next(new Error("Remember to write a new Error setup."));
  if (userId !== reviewById.userId)
    return next(new Error("Remember to write a new Error setup."));

  const { review, stars } = req.body;

  if (reviewById) {
    reviewById.review = review;
  }
  if (stars) review.stars = stars;

  await reviewById.save();

  return res.json(reviewById);
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
