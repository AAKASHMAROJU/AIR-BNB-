// review => comment, rating, createdAt

const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/reviews-db");
}

// main()
//   .then(() => console.log("connected Successfully"))
//   .catch((err) => console.log(err));

const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.model("Review", reviewSchema); // this review should be associated with the Listings

// each Listing => each Building has number of reviews ...
// 1 to many relationships

module.exports = Review;
