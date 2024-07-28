const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../Schema");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  } else {
    next();
  }
};

router.get("/", (req, res) => {
  const { id } = req.params;
  res.render("reviews/createReview", { id });
});

router.post(
  "/",
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

router.delete(
  "/:rId",
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

module.exports = router;
