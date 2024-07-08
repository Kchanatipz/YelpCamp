const express = require("express");
const multer = require("multer");

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
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const router = express.Router();

router
  .route("/")
  .get(catchAsync(showAllCampgrounds))
  .post(
    isLoggedIn,
    upload.array("images"),
    validateCampgroundSchema,
    catchAsync(createCampground)
  );

router.get("/new", isLoggedIn, getCreateForm);

router
  .route("/:id")
  .get(catchAsync(showCampground))
  .put(
    isLoggedIn,
    authorizeCampground,
    upload.array("image"),
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
