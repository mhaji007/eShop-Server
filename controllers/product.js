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
    console.log("Product create error --->", err);
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
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  } catch (err) {
    console.log("Product listAll error --->", err);
    return res.status(400).send("Product listAll failed");
  }
};




exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log("Product remove error --->", err);
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
    console.log("Product read error --->", err);
    return res.status(400).send("Product read failed");
  }
};

exports.update = async (req, res) => {
  // Updates slug
  // If user navigates to previous slug
  // encounters page not found
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log("Product Update error --->", err);
    return res.status(400).send("Product update failed");
  }
};


// // List new arrivals without pagination
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;

//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log("Product list error --->", err);
//     return res.status(400).send("Product list failed");
//   }
// };


// List new arrivals with pagination
exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    // How many products per page
    const perPage = 3;
    // For example request coming in from frontend for page 3
    // we need to skip 6 products
    // (two pages, each containing 3 products ) and
    // start form 7 onwards
    const products = await Product.find({})
      // Each time based on the page number
      // skip the previous page
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log("Product listAll error --->", err);
    return res.status(400).send("Product listAll failed");
}

}

// Find total number of documents (products)
exports.productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();

    res.json(total);
  } catch (err) {
    console.log("Products count error --->", err);
    return res.status(400).send("Products count failed");
  }
};


