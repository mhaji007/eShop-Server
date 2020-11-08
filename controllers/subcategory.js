const SubCategory = require("../models/subcategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(
      await new SubCategory({ name, parent, slug: slugify(name) }).save()
    );
  } catch (err) {
    console.log("Subcategory create error --->", err);
    res.status(400).send("Create subcategory failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(await SubCategory.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    console.log("Subcategory list error --->", err);
    res.status(400).send("Subcategory list failed");
  }
};

exports.read = async (req, res) => {
  try {
    let subcategory = await SubCategory.findOne({
      slug: req.params.slug,
    }).exec();
    res.json(subcategory);
  } catch (err) {
    console.log("Subcategory read error --->", err);
    res.status(400).send("Subcategory read failed");
  }
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log("Subcategory update error --->", err);
    res.status(400).send("Subcategory update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deleted);
  } catch (err) {
    console.log("Subcategory remove error --->", err);
    res.status(400).send("Subcategory delete failed");
  }
};
