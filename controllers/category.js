const Category = require("../models/category");
const slugify = require("slugify");

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

exports.list = async (req, res) =>{
 //
}

exports.read = async (req, res) => {
 //
};

exports.update = async (req, res) => {
//
};

exports.remove = async (req, res) => {
//
};
