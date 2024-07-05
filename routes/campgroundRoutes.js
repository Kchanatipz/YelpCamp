const express = require("express");

const Campground = require("../models/campgroundModel");
const {
  catchAsync,
  validateCampgroundSchema,
  isLoggedIn,
} = require("../utils/middlewares");

const router = express.Router();

// desc     show all campgrounds
// route    GET /campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

// desc     show new campground form
// route    GET /campgrounds/new
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// desc     show campground
// route    GET /campgrounds/:id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// desc     create new campground
// route    POST /campgrounds
router.post(
  "/",
  isLoggedIn,
  validateCampgroundSchema,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// desc     get update campground form
// route    GET /campgrounds/:id/edit
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// desc     update campground
// route    PUT /campgrounds/:id
router.put(
  "/:id",
  isLoggedIn,
  validateCampgroundSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground
    );
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      res.redirect("/campgrounds");
    }
    req.flash("success", "Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// desc     delete campground
// route    DELETE /campgrounds/:id
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
