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
  }
};
