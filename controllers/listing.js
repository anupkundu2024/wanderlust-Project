const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching listings");
  }
};

module.exports.createListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.newListing = async (req, res, next) => {
  let imageFile = req.files["listings[image]"]?.[0];
  let url = imageFile?.path;
  let filename = imageFile?.filename;

  console.log(url, "...", filename);
  const newListing = new Listing(req.body.listings);

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  if (!imageFile) {
    req.flash("error", "Image upload failed");
    return res.redirect("/listings/new");
  }
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listings for your requiest does not exists");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
  let imageFile = req.files["listings[image]"]?.[0];
  if (imageFile) {
    let url = imageFile.path;
    let filename = imageFile.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", " Update Successful");
  return res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
};
