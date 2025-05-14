const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing does not exist");
    res.redirect(`/listings/${id}`);
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  list.reviews.push(newReview);

  await newReview.save();
  await list.save();
  req.flash("success", "Review Added!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  if (!id || !reviewId) {
    throw new ExpressError(400, "Invalid review or listing ID");
  }
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted");
  res.redirect(`/listings/${id}`);
};
