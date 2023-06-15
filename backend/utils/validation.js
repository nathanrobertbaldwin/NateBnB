// backend/utils/validation.js
const { validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const err = Error("Validation error.");
    err.status = 500;
    err.title = "Validation error.";
    const errors = {};
    validationErrors.array().forEach((error) => {
      errors[error.path] = error.msg;
    });
    err.errors = errors;
    return next(err);
  } else {
    const err = Error("Bad request.");
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
};
module.exports = {
  handleValidationErrors,
};
