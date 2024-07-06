const { model } = require("mongoose");
const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");

// desc     create new review
// route    POST /campgrounds/:id/reviews
module.exports.createReview = async (req, res) => {
  const { campId } = req.params;
  const campground = await Campground.findById(campId);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  review.author = req.user._id;
  await review.save();
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// desc     delete review
// route    DELETE /campgrounds/:campId/reviews/reviewId
module.exports.deleteReview = async (req, res) => {
  const { campId, reviewId } = req.params;
  await Campground.findByIdAndUpdate(campId, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");

  res.redirect(`/campgrounds/${campId}`);
};
