const router = require("express").Router();
const sequelize = require("sequelize");
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.delete(":reviewId", requireAuth, async (req, res, next) => {

});

module.exports = router;
