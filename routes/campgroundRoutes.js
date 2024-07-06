const express = require("express");

const {
  showAllCampgrounds,
  getCreateForm,
  showCampground,
  createCampground,
  getUpdateForm,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgroundController");
const {
  catchAsync,
  validateCampgroundSchema,
  isLoggedIn,
  authorizeCampground,
} = require("../utils/middlewares");

const router = express.Router();

router
  .route("/")
  .get(catchAsync(showAllCampgrounds))
  .post(isLoggedIn, validateCampgroundSchema, catchAsync(createCampground));

router.get("/new", isLoggedIn, getCreateForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .put(
    isLoggedIn,
    authorizeCampground,
    validateCampgroundSchema,
    catchAsync(updateCampground)
  )
  .delete(isLoggedIn, authorizeCampground, catchAsync(deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  authorizeCampground,
  catchAsync(getUpdateForm)
);

module.exports = router;
