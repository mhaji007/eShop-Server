const Category = require("../models/category");
const Subcategoy = require("../models/subcategory");
const slugify = require("slugify");

// Return an object
// containing the information of the category just created
exports.create = async (req, res) => {
  try {
    // Grab data from the frontend (all is needed is name)
    // destructure name
    const { name } = req.body;
    // const category = await new Category({ name, slug: slugify(name) }).save();
    // res.json(category);
    res.json(await new Category({ name, slug: slugify(name).toLowerCase()}).save());
  } catch (err) {
    // console.log(err);
    res.status(400).send("Create category failed");
  }
};

// Return an array of objects
// containing the information for all the created categories
exports.list = async (req, res) =>{
  // find({}) returns all the collection
  // sort({createdAt: -1}) returns latest categories at the top
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
}

// Return an object
// containing the information for a single requested category
exports.read = async (req, res) => {
// req.params contains the route parameter (i.e., the requested category)
  let category = await Category.findOne({ slug: req.params.slug }).exec();

  // // If not using async await the above would be written as
  // let category = await Category.findOne({ slug: req.params.slug }).exec((err, data) => {
  //   data // category
  // });

  res.json(category);
};

// Return an object containing
// the updated category information
exports.update = async (req, res) => {
  // name to be updated to
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      // Find category based on slug
      // req.params.slug looks for a
      // route parameter with a key
      // of slug
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      // Optional
      // but if not used
      // the json response will
      // contain the old category information
      // instead of the recently updated info
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send("Create update failed");
  }
};
// Return an object
// containing the deleted category information
exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Create delete failed");
  }
};

// Return an object
// containing infomation for all the subcategoriers that share the same parent
// alternative to async await
exports.getSubs = (req, res) => {
  Subcategory.find({parent: req.params._id}.exec((err, subcategoies) => {
    if(err) console.log(err);
    res.json(subcategoies);
  }))
}
