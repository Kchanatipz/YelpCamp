// const axios = require("axios");
const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const cities = require("./cities");
const { places, descriptors, images, owners } = require("./sampleData");

// const sampleImg = async () => {
//   try {
//     const res = await axios.get("https://api.unsplash.com/photos/random", {
//       params: {
//         client_id: process.env.UNSPLASH_ACCESS_KEY,
//         collections: 1114848,
//         count: 30,
//       },
//     });
//     return res.data.map((a) => a.urls.full);
//   } catch (err) {
//     console.error(err);
//   }
// };

const baseURL = "https://res.cloudinary.com/dbi2rnjhe/image/upload/";

const sampleData = (array) => array[Math.floor(Math.random() * array.length)];

const sampleName = () => `${sampleData(descriptors)} ${sampleData(places)}`;

const sampleCities = () => sampleData(cities);

const sampleImage = () => `${baseURL}${sampleData(images)}`;

const sampleDescription = () => {
  const text =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam consequuntur voluptate, facere dolor molestiae nobis culpa tempore";
  const randLength = Math.floor(Math.random() * text.length) + 1;
  return `${text.slice(0, randLength)}${randLength === 300 ? "" : "."}`;
};

const samplePrice = (maxValue) => Math.floor(Math.random() * maxValue) + 10;

const sampleOwner = () => sampleData(owners);

const makeDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const city = sampleCities();

    const camp = new Campground({
      name: sampleName(),
      location: `${city.city}, ${city.state}`,
      images: [
        {
          url: sampleImage(),
          filename: "",
        },
      ],
      description: sampleDescription(),
      price: samplePrice(50),
      owner: sampleOwner(),
      geometry: {
        type: "Point",
        coordinates: [city.longitude, city.latitude],
      },
    });

    await camp.save();
  }
};

module.exports = makeDB;
