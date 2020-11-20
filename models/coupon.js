const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: "Name is required",
      minlength: [6, "Name must be at least 6 characters long"],
      maxlenght: [12, "Name cannot exceed 12 characters"],
    },
    expiry: {
      type: Date,
      required: true,
    },
    // How much percentage off
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
