const router = require("express").Router();
const { Spot, User, Review } = require("../../db/models");

router.get("/current", async (req, res, next) => {
  const users = await Spot.findAll({ include: User });
  // const allSpots = await Spot.findAll({
  //   include: [
  //     {
  //       model: User,
  //       through: { exclude: [] },
  //     },
  //   ],
  // });
  res.json(users);
});

router.use((req, res, next) => {
  const err = Error("Bad request.");
  err.status = 400;
  err.title = "Bad request.";
  res.json(err);
});

module.exports = router;
