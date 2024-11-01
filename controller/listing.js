const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const d = await Listing.find();
  res.render("listings/showData.ejs", { data: d });
};

module.exports.newListing = (req, res) => {
  res.render("listings/createListing.ejs");
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const data = await Listing.findById(id);
  if (!data) {
    req.flash("error", "Listing you are Looking for Does not Exist");
    res.redirect("/listings");
  }
  res.render("listings/editListing", { data: data });
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const data = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author", model: "User" },
    })
    .populate("owner");
  if (!data) {
    req.flash("error", "Listing you are Looking for Does not Exist");
    res.redirect("/listings");
  }
  res.render("listings/showListing", { data });
};

module.exports.createListing = async (req, res, next) => {
  const { path, filename } = req.file;
  const { title, description, price, location, country } = req.body;
  const doc1 = {
    title,
    description,
    image: { url: path, filename: filename },
    price,
    location,
    country,
  };
  doc1.owner = req.user._id;
  // console.log("owner   ", req.user);

  req.flash("success", "Listing has been Created Successfully");
  await Listing.insertMany([doc1]);
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const { title, description, price, location, country } = req.body;
  let doc1 = {
    title,
    description,
    price,
    location,
    country,
  };
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    doc1.image = { url, filename };
  }
  Listing.findByIdAndUpdate(id, doc1).then((data) => {
    req.flash("success", "Listing has been Updated Successfully");
    res.redirect("/listings/" + id);
  });
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id).then((data) => {
    req.flash("success", "Listing has been Deleted Successfully");
    res.redirect("/listings");
  });
};
