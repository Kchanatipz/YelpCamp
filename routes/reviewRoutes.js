const express = require("express");

const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const {
  catchAsync,
  validateReviewSchema,
  isLoggedIn,
  authorizeReview,
} = require("../utils/middlewares");

// express router get seperate params from the parent route
// mergeParams: true will merge the params
// from the parent route with the current route
const router = express.Router({ mergeParams: true });

// desc     create new review
// route    POST /campgrounds/:id/reviews
router.post(
  "/",
  isLoggedIn,
  validateReviewSchema,
  catchAsync(async (req, res) => {
    const { campId } = req.params;
    const campground = await Campground.findById(campId);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// desc     delete review
// route    DELETE /campgrounds/:campId/reviews/reviewId
router.delete(
  "/:reviewId",
  isLoggedIn,
  authorizeReview,
  catchAsync(async (req, res) => {
    const { campId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campId, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");

    res.redirect(`/campgrounds/${campId}`);
  })
);

module.exports = router;
