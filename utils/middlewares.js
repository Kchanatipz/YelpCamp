const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
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

// desc     protect unauthorize user (not owner)
//          from updating and deleting campground
module.exports.authorizeCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// desc     protect not-author user to from deleting review
module.exports.authorizeReview = async (req, res, next) => {
  const { campId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  console.log(review);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${campId}`);
  }
  next();
};
