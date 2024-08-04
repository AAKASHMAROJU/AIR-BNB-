const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../Schema");
const isLoggedIn = require("../middleware");

const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const d = await Listing.find();
    res.render("listings/showData.ejs", { data: d });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/createListing.ejs");
});

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Listing.findById(id);
    if (!data) {
      req.flash("error", "Listing you are Looking for Does not Exist");
      res.redirect("/listings");
    }
    res.render("listings/editListing", { data: data });
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    // console.log(req.params);
    const { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    if (!data) {
      req.flash("error", "Listing you are Looking for Does not Exist");
      res.redirect("/listings");
    }
    res.render("listings/showListing", { data });
  })
);
// Inserting
router.post(
  "/",
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
    req.flash("success", "Listing has been Created Successfully");
    await Listing.insertMany([doc1]);
    res.redirect("/listings");
  })
);

router.patch(
  "/:id",
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
      req.flash("success", "Listing has been Updated Successfully");
      res.redirect("/listings/" + id);
    });
  })
);
// when you delete the Listing => delete all the related reviews also .....
router.delete("/:id/delete", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id).then((data) => {
    req.flash("success", "Listing has been Deleted Successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
