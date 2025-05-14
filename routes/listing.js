const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isowner, validateListing } = require("../middelware.js");

const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });

// Import controller functions
const {
  index,
  createListing,
  newListing,
  showListing,
  editListing,
  updateListing,
  deleteListing,
} = require("../controllers/listing.js");

//  Use Multer .fields() to support 'listings[image]' field
const uploadListingImage = upload.fields([
  { name: "listings[image]", maxCount: 1 },
]);

// Route to get all listings or post a new one
router.route("/").get(wrapAsync(index)).post(
  isLoggedIn,
  uploadListingImage, //  handles 'listings[image]'
  // validateListing,
  wrapAsync(newListing)
);

// Route to display new listing form
router.get("/new", isLoggedIn, createListing);

// Route for individual listing operations (show, update, delete)
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isowner,
    uploadListingImage, // only one multer middleware
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isowner, wrapAsync(deleteListing));

// Route to display edit form
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(editListing));

// Route to display edit form
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(editListing));

module.exports = router;
