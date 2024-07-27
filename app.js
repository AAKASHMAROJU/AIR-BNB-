const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { wrap } = require("module");
const { listingSchema, reviewSchema } = require("./Schema");
const Review = require("./models/review");

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

const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  } else {
    next();
  }
};

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const d = await Listing.find();
    res.render("listings/showData.ejs", { data: d });
  })
);

app.get("/listings/new", (req, res) => {
  res.render("listings/createListing.ejs");
});

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findById(id).then((data) => {
      console.log("FInd by ID prints ", data);
      res.render("listings/editListing", { data: data });
    });
  })
);

app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    // console.log(req.params);
    const { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    res.render("listings/showListing", { data });
  })
);

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const { title, description, url, price, location, country } = req.body;
    const doc1 = {
      title,
      description,
      image: { url: url },
      price,
      location,
      country,
    };
    await Listing.insertMany([doc1]);
    res.redirect("/listings");
  })
);

app.patch(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    // console.log(req.body);
    const { title, description, url, price, location, country } = req.body;
    const doc1 = {
      title,
      description,
      image: { url: url },
      price,
      location,
      country,
    };
    // console.log("Doc1", doc1);
    const { id } = req.params;
    Listing.findById(id).then((data) => {
      console.log("Found out ", data);
    });
    Listing.findByIdAndUpdate(id, doc1).then((data) => {
      // console.log("Updated Data", data);
      res.redirect("/listings/" + id);
    });
  })
);
// when you delete the Listing => delete all the related reviews also .....
app.delete("/listings/:id/delete", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id).then((data) => {
    // console.log(data);
    res.redirect("/listings");
  });
});

app.get("/about", (req, res) => {
  res.send("This is About Us Page");
});

app.get("/listings/:id/review", (req, res) => {
  const { id } = req.params;
  res.render("reviews/createReview", { id });
});

app.post(
  "/listings/:id/review",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    // const {content, create.d}=req.body;
    const { comment, rating, date } = req.body;

    // send this to reviews db
    const doc = { comment, rating, date };
    const data = await Review.insertMany([doc]);
    console.log("The Value in data[0] id is : " + data[0]);
    // const data_json = await Listing.findOne
    // // this review corresponds to which building list
    const result = await Listing.findByIdAndUpdate(id, {
      $push: { reviews: data[0] },
      function(err, success) {
        if (err) {
          console.log(err);
        } else {
          console.log(success);
        }
      },
    });

    // res.send("Heyy there Data Posted Correctly");
    res.redirect(`/listings/${id}`);
  })
);

app.delete(
  "/listings/:id/review/:rId",
  wrapAsync(async (req, res) => {
    const { id, rId } = req.params; // this id is listing ID
    // const { rid } = rid; // review ID
    // goto Listing and delete reviewID from the reviews array and redirect to review page
    console.log(id, rId);
    // things to do1. delete the reference in ListingSchema and also delete the Review from reviewdb
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: rId },
    });
    await Review.findByIdAndDelete(rId); // deleting thr review
    res.redirect(`/listings/${id}`);
    // await Listing.findByIdAndDelete(id);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  // console.log(err);
  const { statusCode = 500, message = "Something went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.send("I Handled the Error it is " + err);
});

app.listen(port, () => {
  console.log("The Server has Started at Port " + port);
});
