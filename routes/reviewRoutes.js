const express = require("express");

const {
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
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

router.post("/", isLoggedIn, validateReviewSchema, catchAsync(createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  authorizeReview,
  catchAsync(deleteReview)
);

module.exports = router;
