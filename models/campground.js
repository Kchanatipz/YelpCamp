const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  location: String,
  image: String,
});

const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
