const mongoose = require("mongoose");
const MONGODB_URL = "mongodb://127.0.0.1:27017/airbnb-db";

const data = require("./data");

const Listing = require("./../models/listing");
// const Schema = ;

async function main() {
  await mongoose.connect(MONGODB_URL);
}

main()
  .then(() => console.log("The DB is conneted"))

  .catch((e) => console.log(e));

async function initDB() {
  await Listing.deleteMany({});
  await Listing.insertMany(data.data);
  console.log("Data Initialization performed successfully");
}

initDB();
