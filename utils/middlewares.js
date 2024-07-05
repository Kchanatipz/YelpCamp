const ExpressError = require("./ExpressError");
const {
  JoiCampgroundSchema,
  JoiReviewSchema,
} = require("../models/joiSchemas");

// desc     catch async error
module.exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// desc     validate campground schema using JOI
module.exports.validateCampgroundSchema = (req, res, next) => {
  const { error } = JoiCampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// desc     validate review schema using JOI
module.exports.validateReviewSchema = (req, res, next) => {
  const { error } = JoiReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// desc     check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signned in");
    return res.redirect("/login");
  }
  next();
};

// desc     store retun to value in locals
//          to redirect user to current page after login
module.exports.storeReturnTo = async (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
