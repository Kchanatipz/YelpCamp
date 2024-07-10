const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviewModel");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// by default mongoose doesn't include virtuals
// when converted to JSON format
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      // [longitude, latitude]
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opts
);

CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// to make a popUp for cluster map
// (GeoJSON only accepts properties as an object)
CampgroundSchema.virtual("properties.popUp").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.name}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;
