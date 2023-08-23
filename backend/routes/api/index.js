// ============================== IMPORTS ============================== //

const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const bookingsRouter = require("./bookings.js");
const spotImagesRouter = require("./spot-images.js");
const reviewsRouter = require("./reviews.js");
const reviewImagesRouter = require("./review-images.js");
const mapsRouter = require("./maps.js");
const { restoreUser } = require("../../utils/auth.js");

// ============================ MIDDLEWARE ============================ //

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/spot-images", spotImagesRouter);
router.use("/bookings", bookingsRouter);
router.use("/reviews", reviewsRouter);
router.use("/review-images", reviewImagesRouter);
router.use("/maps", mapsRouter);

// router.post("/test", (req, res) => {
//   res.json({ requestBody: req.body });
// });

// ============================== EXPORTS ============================== //

module.exports = router;
