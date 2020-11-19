const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    // Each cart has one or more product
    products: [
      {
        // Each product has its own fields
        // and fields that are dependent on
        // user selection

        // Own fields
        // accessible via ref and populate
        product: {
          type: ObjectId,
          ref: "Product",
        },
        // Added fields
        // How many products user is trying
        // to purchase
        count: Number,
        // What color user has selected
        color: String,
        // Price of the product selected by user
        price: Number,
      },
    ],
    // Total before discount/applying coupon

    // This value is calcualted in the controller
    // after successfully adding the count and
    // retrieveing the product price from the backend
    cartTotal: Number,
    // Total after discount/applying coupon
    totalAfterDiscount: Number,
    // Cart associated with the logged in user
    orderedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
