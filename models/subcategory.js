const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [32, 'Name cannot exceed 32 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    // Each subcategory must have a category
    // the benefit of using objectId is that later we can make request to and
    // display subcategory based on the parent category
    parent: { type: ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subcategorySchema);
