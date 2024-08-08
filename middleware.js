const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./Schema");
const { reviewSchema } = require("./Schema");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log("Lemme store here");

    req.session.redirectUrl = req.originalUrl;
    // console.log("The url goes like ", req.session.redirectUrl);

    req.flash("error", "you need to login");
    return res.redirect("/login");
  }
  return next();
};

module.exports.saveRedirectUrl = async (req, res, next) => {
  console.log("Hello");
  if (req.session.redirectUrl) res.locals.redirectUrl = req.session.redirectUrl;
  // console.log("Ippdu value entha ", res.locals.redirectUrl);

  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let data = await Listing.findById(id);
  if (!data.owner.equals(res.locals.user?._id)) {
    req.flash(
      "error",
      "You cannot Perform this operation... Invalid Owner Access"
    );
    res.redirect("/listings/" + id);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, rId } = req.params;
  // review author and user should be same
  // listing Id, reviewId
  const rdata = await Review.findById(rId);
  if (!rdata.author.equals(res.locals.user._id)) {
    req.flash("error", "You cannot delete other author's comment");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
