const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose
      .connect("mongodb://127.0.0.1/yelp-camp")
      .then(() => {
        console.log("Mongo connected");
      })
      .catch((err) => {
        console.log("Mongo connection error");
        console.log(err);
      });
  } catch (error) {
    console.log("Mongo connection error");
    console.log(err);
  }
};

module.exports = connectDB;
