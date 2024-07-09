const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const MONGODB_URL = "mongodb://localhost:27017/airbnb-db";

async function main() {
  await mongoose.connect(MONGODB_URL);
}

main()
  .then(() => console.log("DataBase Connected Successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/listings", (req, res) => {
  Listing.find()
    .then((d) => {
      res.render("listings/showData.ejs", { data: d });
    })
    .catch((e) => {
      res.render("error");
    });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/createListing.ejs");
});

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((data) => {
      res.render("listings/editListing", { data: data });
    })
    .catch((err) => {
      res.render("error");
    });
  // res.send("Hi");
});

app.get("/listings/:id", async (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  Listing.findById(id)
    .then((data) => {
      res.render("listings/showListing", { data: data });
    })
    .catch((err) => {
      res.render("error");
    });
});

app.post("/listings", async (req, res) => {
  console.log(req.body);
  const { title, description, URL, price, location, country } = req.body;
  const doc1 = { title, description, image: URL, price, location, country };
  Listing.insertMany([doc1])
    .then((data) => {
      console.log("Inserted Successfully");
    })
    .catch((err) => {
      console.log("errors Occured");
    });
  res.redirect("/listings");
});

app.patch("/listings/:id", async (req, res) => {
  console.log(req.body);
  const { price } = req.body;
  const { id } = req.params;
  Listing.findByIdAndUpdate(id, { price: price })
    .then((data) => {
      console.log(data);
      res.redirect("/listings/" + id);
    })
    .catch((err) => {
      res.render("error");
    });
});

app.delete("/listings/:id/delete", (req, res) => {
  const { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then((data) => {
      console.log(data);
      res.redirect("/listings");
    })
    .catch((err) => {
      res.redirect("error");
    });
});

app.get("/about", (req, res) => {
  res.send("This is About Us Page");
});

app.listen(port, () => {
  console.log("The Server has Started at Port " + port);
});
