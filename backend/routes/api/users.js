// ============================== IMPORTS ============================== //

const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { userAlreadyExistsError } = require("../../utils/errors");

const router = express.Router();

// ============================= MIDDLEWARE ============================= //

const validateSignup = [
  check("email")
    .exists()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .custom(async (value) => {
      const users = await User.findAll({
        attributes: ["email"],
      });
      users.forEach((user) => {
        if (user.email === value)
          throw new userAlreadyExistsError(
            "User with that email already exists."
          );
      });
    })
    .withMessage("User with that email already exists."),
  check("username")
    .exists()
    .custom(async (value) => {
      const users = await User.findAll({
        attributes: ["username"],
      });
      users.forEach((user) => {
        if (user.username === value)
          throw new userAlreadyExistsError(
            "User with that username already exists."
          );
      });
    })
    .withMessage("User with that username already exists."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists()
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// ============================= POST ROUTES =========================== //

// --------------------------- Create a New User ----------------------- //

router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

// ============================== EXPORTS ============================== //

module.exports = router;
