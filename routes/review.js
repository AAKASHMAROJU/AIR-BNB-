const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controller/review");

router
  .route("/")
  .get(reviewController.renderCreateReview)
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete(
  "/:rId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
