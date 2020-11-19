const mongoose = required('mongoose')
const {ObjectId} =  mongoose.Schema

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type:ObjectId,
        ref:"Product"
      },
      // How many products user is trying
      // to purchase
      count: Number,
      // What color user has selected
      color:String,
      // Price of the product selected by user
      price: Number,
    },
  ],
  // Total before discount/applying coupon
  cartTotal: Number,
  // Total after discount/applying coupon
  totalAfterDiscount: Number,
  // Cart associated with the logged in user
  orderedBy:{type: ObjectId, ref:"User"},

},
  {timestamps: true}

);

module.exports = mongoose.model("Cart", cartSchema);
