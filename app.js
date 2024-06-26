const express = require("express");
const path = require("path");
const meethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { JoiCampgroundSchema } = require("./models/joiSchemas");

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(meethodOverride("_method"));

const connectDB = require("./db");
const makeDB = require("./seed/index");
connectDB();
makeDB();

const validateCampgroundSchema = (req, res, next) => {
  const { error } = JoiCampgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

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
    const campground = await Campground.findById(id);
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
    res.redirect(`/campgrounds/${campground._id}`);
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
