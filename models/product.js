const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: 'Title is required',
      maxlength: [32, 'Title cannot exceed 32 characters'],
      // Enables searching
      // the database by title
      // when implementing the search
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,

      // Althought slugs must be
      // unique but it is
      // not required to be explicitly
      // mentioned here because it will
      // be generated in the controller
      // itself and therefore it will
      // always be there
      // required: true

      // Enables querying the database
      // based on the slug
      index: true,
    },
    // We can use either title
    // or descripttion to search
    // the database
    description: {
      type: String,
      required: 'Description is required',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      text: true,
    },
    price: {
      type: Number,
      required: 'Price is required',
      trim: true,
      maxlength: [32, 'Price cannot exceed 32 characters'],
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    // // Subcategories will
    // // be more than one and
    // // therefore of type array.
    // // There will be one main
    // // category and many subcategories
    // // based on that category
    // // Instead of saving the entire
    // // subcategory information, we save just
    // // the id and later use the populate method
    // // to retrieve the entire information
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    // Used for keeping
    // stock
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    // images: {
    //   type: Array,
    // },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    // Hardcoded for now
    // If someone get assigned an admin
    // role by accident, they cannot
    // assign random brand or color
    // because they are built into the schema
    // (only these will be saved in the db)
    // Can be extracted to
    // its own CRUD like category
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue"],
    },
    // Hardcoded for now
    // If someone get assigned an admin
    // role by accident, they cannot
    // assign random brand or color
    // because they are built into the schema
    // (only these will be saved in the db)
    // Can be extracted to
    // its own CRUD like category
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    },
    // ratings: [
    //   {
    //     star: Number,
    //     postedBy: { type: ObjectId, ref: "User" },
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
