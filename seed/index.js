const mongoose = require("mongoose");
const Campground = require("../models/campground");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const makeDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[rand].city}, ${cities[rand].state}`,
    });
    await camp.save();
  }
};

module.exports = makeDB;
