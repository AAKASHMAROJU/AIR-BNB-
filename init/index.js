const mongoose = require("mongoose");
const MONGODB_URL = "mongodb://127.0.0.1:27017/airbnb-db";

const initData = require("./data");

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
  const data = initData.data.map((e) => ({
    ...e,
    owner: "66ae44af3895d8b287ccd36a",
  }));
  await Listing.insertMany(data);
  console.log("Data Initialization performed successfully");
}

initDB();
