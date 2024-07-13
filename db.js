const mongoose = require("mongoose");

const connectDB = (url) => {
  try {
    mongoose
      .connect(url)
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
