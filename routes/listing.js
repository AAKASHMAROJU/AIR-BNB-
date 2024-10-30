const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../middleware");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controller/listing");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(upload.single("url"), (req, res) => {
    res.send(req.file);
  });
// .post(validateListing, wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.newListing);

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .patch(validateListing, isOwner, wrapAsync(listingController.updateListing));
// Inserting

// when you delete the Listing => delete all the related reviews also .....
router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
