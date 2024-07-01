const ExpressError = require("./ExpressError");
const {
  JoiCampgroundSchema,
  JoiReviewSchema,
} = require("../models/joiSchemas");

module.exports.validateCampgroundSchema = (req, res, next) => {
  const { error } = JoiCampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateReviewSchema = (req, res, next) => {
  const { error } = JoiReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
