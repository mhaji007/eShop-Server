const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      // Better to have this property
      // Since user is found through
      // their email
      index: true,
    },
    role: {
      type: String,
      default: "subscriber",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    // Save productId and based on that
    // we will be able to access all the
    // product information based on that Id
    // wishlist: [{type: ObjectId, ref:"Product"}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
