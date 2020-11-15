const Category = require("../models/category");
const Product = require("../models/product");
const Subcategory = require("../models/subcategory");
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
    res.json(
      await new Category({ name, slug: slugify(name).toLowerCase() }).save()
    );
  } catch (err) {
    console.log("Category create error --->", err);
    res.status(400).send("Category category failed");
  }
};

// Return an array of objects
// containing the information for all the created categories
exports.list = async (req, res) => {
  // find({}) returns all the collection
  // sort({createdAt: -1}) returns latest categories at the top
  try {
    let list = await Category.find({}).sort({ createdAt: -1 }).exec();
    res.json(list);
  } catch (err) {
    {
      console.log("Category list error --->", err);
      res.status(400).send("Category list failed");
    }
  }
};

// // Return an object
// // containing the information for a single requested category
// // This method does not return all the asscoiated products
// // that share the same category
// exports.read = async (req, res) => {
//   // req.params contains the route parameter (i.e., the requested category)
//   let category = await Category.findOne({ slug: req.params.slug }).exec();

//   if (err) {
//     console.log("Category read error --->", err);
//     res.status(400).send("Category read failed");
//   }

//   // // If not using async await the above would be written as
//   // let category = await Category.findOne({ slug: req.params.slug }).exec((err, data) => {
//   //   data // category
//   // });

//   res.json(category);
// };

// Return an object
// containing the information for a single requested category and
// all related products based on the category id
// Used when user clicks on one of the categories
// listed in the homepage
exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();

  // Query products as well
  // No need to specify category._id as Mongoose
  // automatically detects that id is meant here
  // therefore Product.find({category:category})
  // which is equivalent to the following
  const products = await Product.find({ category })
    .populate("category")
    // no postedBy in product model
    // .populate('postedBy', "_id name")
    .exec();

  res.json({
    category,
    products,
  });
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
    console.log("Category updated error --->", err);
    res.status(400).send("Category update failed");
  }
};
// Return an object
// containing the deleted category information
exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log("Category remove error --->", err);
    res.status(400).send("Category delete failed");
  }
};

// Return an object
// containing infomation for all the subcategories that share the same parent
// alternative to async await syntax
exports.getSubs = (req, res) => {
  Subcategory.find({ parent: req.params._id }).exec((err, subcategories) => {
    if (err) {
      console.log("Category getsubs error --->", err);
      res.status(400).send("Category getSubs failed");
    }
    res.json(subcategories);
  });
};
