const express = require("express");

const Campground = require("../models/campgroundModel");
const {
  catchAsync,
  validateCampgroundSchema,
  isLoggedIn,
  authorizeCampground,
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
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      return res.redirect("/campgrounds");
    }
    console.log(campground);
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
    campground.owner = req.user._id;
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
  authorizeCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// desc     update campground
// route    PUT /campgrounds/:id
router.put(
  "/:id",
  isLoggedIn,
  authorizeCampground,
  validateCampgroundSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      return res.redirect("/campgrounds");
    }
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// desc     delete campground
// route    DELETE /campgrounds/:id
router.delete(
  "/:id",
  isLoggedIn,
  authorizeCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      return res.redirect("/campgrounds");
    }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
