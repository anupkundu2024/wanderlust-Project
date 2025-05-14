const express = require("express");
const router = express.Router({ mergeParams: true }); // Add mergeParams: true
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middelware.js");

const Listing = require("../models/listing.js");

const { postReview, deleteReview } = require("../controllers/reviews.js");

// Reviews POST Route
router.post("/", isLoggedIn, validateReview, wrapAsync(postReview));

// Reviews Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
