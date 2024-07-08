// const axios = require("axios");
const Campground = require("../models/campgroundModel");
const Review = require("../models/reviewModel");
const cities = require("./cities");
const {
  places,
  descriptors,
  images,
  images2,
  owners,
} = require("./sampleData");

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

const frontURL = "https://images.unsplash.com/photo-";
const backURL =
  "?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2MjU4OTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTkzMjYxNzN8&ixlib=rb-4.0.3&q=85";
const baseURL = "https://res.cloudinary.com/dbi2rnjhe/image/upload/";

const sampleData = (array) => array[Math.floor(Math.random() * array.length)];

const sampleName = () => `${sampleData(descriptors)} ${sampleData(places)}`;

const sampleLocation = () => {
  const randIdx = Math.floor(Math.random() * 1000);
  return `${cities[randIdx].city}, ${cities[randIdx].state}`;
};

const sampleImage = () => `${frontURL}${sampleData(images)}${backURL}`;
const sampleImage2 = () => `${baseURL}${sampleData(images2)}`;

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
    const camp = new Campground({
      name: sampleName(),
      location: sampleLocation(),
      // image: sampleImage(),
      images: [
        {
          url: sampleImage2(),
          filename: "",
        },
      ],
      description: sampleDescription(),
      price: samplePrice(20),
      owner: sampleOwner(),
    });

    await camp.save();
  }
};

module.exports = makeDB;
