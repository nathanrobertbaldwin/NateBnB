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

// ----------------  Validator for Post New Review Image ---------------- //

const validatePostReviewImage = [
  check("url")
    .exists()
    .withMessage("url must exist.")
    .isString()
    .withMessage("url must be a string")
    .isURL()
    .withMessage("url string must be a URL."),
  handleValidationErrors,
];

// -----------------  Validator for Put Edit a Review ------------------ //

const validatePutEditReview = [
  check("review").exists().isString().withMessage("Review text is required"),
  check("stars")
    .optional()
    .isNumeric({ min: 0, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// ============================= GET ROUTES ============================ //

// ---------------- Get all Reviews of the Current User ---------------- //

router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.dataValues.id;
  let allReviews = await User.findByPk(userId, {
    where: { id: userId },
    attributes: [],
    include: {
      model: Review,
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        {
          model: Spot,
          attributes: { exclude: ["description", "createdAt", "updatedAt"] },
          include: {
            model: SpotImage,
            attributes: ["url"],
            where: { preview: true },
          },
        },
        { model: ReviewImage, attributes: ["id", "url"] },
      ],
      group: ["User.id", "Spots.id", "ReviewImage.id"],
    },
  });

  const unPacked = allReviews.Reviews.map((review) => review.toJSON());

  unPacked.forEach((review) => {
    review.Spot.previewImage = review.Spot.SpotImages[0].url;
    delete review.Spot.SpotImages;
  });

  res.json({ Reviews: unPacked });
});

// ============================ POST ROUTES ============================ //

// ------- Add an Image to a Review based on the Review's id ---------- //

router.post(
  "/:reviewId/images",
  requireAuth,
  validatePostReviewImage,
  async (req, res, next) => {
    const reviewId = parseInt(req.params.reviewId);
    const review = await Review.findByPk(reviewId, {
      include: { model: ReviewImage },
    });

    if (!review)
      return next(new noResourceExistsError("Review couldn't be found"));

    const ownerId = req.user.dataValues.id;

    if (ownerId !== review.userId) {
      return next(new AuthorizationError("Forbidden"));
    }

    if (review.ReviewImages.length > 10) {
      return next(
        new AuthorizationError(
          "Maximum number of images for this resource was reached"
        )
      );
    }

    const { url } = req.body;
    const newReviewImage = await ReviewImage.build({ url, reviewId });

    await newReviewImage.save();

    res.json({ id: newReviewImage.id, url: newReviewImage.url });
  }
);

// ============================ PUT ROUTES ============================ //

// --------------------------- Edit A Review -------------------------- //

router.put(
  "/:reviewId",
  requireAuth,
  validatePutEditReview,
  async (req, res, next) => {
    const reviewById = await Review.findByPk(req.params.reviewId);

    if (!reviewById)
      return next(new noResourceExistsError("Review couldn't be found"));

    const userId = req.user.dataValues.id;

    if (userId !== reviewById.userId) {
      return next(new AuthorizationError("Forbidden"));
    }

    const { review, stars } = req.body;

    if (reviewById) reviewById.review = review;
    if (stars) review.stars = stars;
    reviewById.updatedAt = new Date();

    await reviewById.save();

    return res.json(reviewById);
  }
);

// =========================== DELETE ROUTES =========================== //

// ------------------------- Delete A Review --------------------------- //

router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const reviewId = parseInt(req.params.reviewId);
  const review = await Review.findByPk(reviewId);

  if (!review)
    return next(new noResourceExistsError("Review couldn't be found"));

  const ownerId = req.user.dataValues.id;

  if (ownerId !== review.userId) {
    return next(new AuthorizationError("Forbidden"));
  }

  await Review.destroy({ where: { id: req.params.reviewId } });

  return res.json({
    message: "Successfully deleted",
  });
});

// ============================== EXPORTS ============================== //

module.exports = router;
