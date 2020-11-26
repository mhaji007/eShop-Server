const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
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
        // Wil be retrieved from Strip as response
        // so not needed here
        // price: Number,
      },
    ],
    // Object type is used here
    // since we don't know what
    // kind of data we are receiving
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      // Enum values sent
      // from the frontend
      // for security purposes
      // so none other than that
      // these particular values
      // are processed
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Completed",
      ],
    },
    orderedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);





