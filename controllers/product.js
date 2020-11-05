const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    // Make sure data is received from the frontend
    console.log(req.body);
    // Create a slug based on the title. Add slug to the request body
    req.body.slug = slugify(req.body.title);
    // Create new product
    // (all necessary information is avaialble on the request body now)
    // save created product in the database
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).send("Create product failed");

    // // Send specific message from mongoose
    // res.status(400).json({
    //   err:err.message
    // })
  }
};

// exports.read = async (req, res) => {
//   try {
//     // Make sure data is received from the frontend
//     console.log(req.body);
//     // let products = await Product.find({}).populate('category');
//     let products = await Product.find({});
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate("category")
      .populate("subs")
      .exec();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product read failed");
  }
};
