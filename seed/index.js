const mongoose = require("mongoose");
const axios = require("axios");
const Campground = require("../models/campground");

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const sampleData = (array) => array[Math.floor(Math.random() * array.length)];

const sampleImg = async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: process.env.UNSPLASH_ACCESS_KEY,
        collections: 1114848,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
};

const images = [];

// for (let i = 0; i < 10; i++) {
//   images.push(sampleImg());
// }

const makeDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randIdx = Math.floor(Math.random() * 1000);
    const randPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sampleData(descriptors)} ${sampleData(places)}`,
      location: `${cities[randIdx].city}, ${cities[randIdx].state}`,
      // image: `${sampleData(images)}`,
      image: "https://random.imagecdn.app/500/150",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam consequuntur voluptate, facere dolor molestiae nobis culpa tempore, harum eligendi expedita fuga maiores deserunt animi, recusandae quam aperiam. Dolores, aut repudiandae! Tempore alias, dicta vitae blanditiis eius enim cum maiores.",
      price: randPrice,
    });
    await camp.save();
  }
};

module.exports = makeDB;
