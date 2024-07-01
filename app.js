const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const {
  validateCampgroundSchema,
  validateReviewSchema,
} = require("./utils/validateSchema");

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const connectDB = require("./db");
const makeDB = require("./seed/index");
connectDB();
makeDB();

app.get("/", (req, res) => {
  res.render("home");
});

// desc     show all campgrounds
// route    GET /campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

// desc     show new campground form
// route    GET /campgrounds/new
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// desc     show campground
// route    GET /campgrounds/:id
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

// desc     create new campground
// route    POST /campgrounds
app.post(
  "/campgrounds",
  validateCampgroundSchema,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// desc     get update campground form
// route    GET /campgrounds/:id/edit
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

// desc     update campground
// route    PUT /campgrounds/:id
app.put(
  "/campgrounds/:id",
  validateCampgroundSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      req.body.campground
    );
    res.send("JO");
  })
);

// desc     delete campground
// route    DELETE /campgrounds/:id
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// desc     create new review
// route    POST /campgrounds/:id/reviews
app.post(
  "/campgrounds/:id/reviews",
  validateReviewSchema,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:campId/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { campId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campId, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campId}`);
  })
);

// throw page not found error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// catch all errors and render error.ejs page
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong :(";
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
