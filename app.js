const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const meethodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const dotenv = require("dotenv");
const Campground = require("./models/campground");

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(meethodOverride("_method"));
dotenv.config({ path: "./config/config.env" });

const connectDB = require("./db");
const makeDB = require("./seed/index");
connectDB();
makeDB();

app.get("/", (req, res) => {
  res.render("home");
});

// desc     show all campgrounds
// route    GET /campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
});

// desc     show new campground form
// route    GET /campgrounds/new
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// desc     show campground
// route    GET /campgrounds/:id
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

// desc     create new campground
// route    POST /campgrounds
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// desc     get update campground form
// route    GET /campgrounds/:id/edit
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

// desc     update campground
// route    PUT /campgrounds/:id
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground
  );
  res.redirect(`/campgrounds/${campground._id}`);
});

// desc     delete campground
// route    DELETE /campgrounds/:id
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
