const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const { couponApplied } = req.body;

  // Apply coupon
  // Calculcate price

  // Get the currenlty logged-in user cart and
  // extract the amount to be charged

  // Find user
  const user = await User.findOne({ email: req.user.email }).exec();
  // Get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  console.log(
    "CART total before discount",
    cartTotal,
    "After Discount",
    totalAfterDiscount
  );

  let finalAmount = 0;
  // Stripe allow only integer value in price
  // so need to change price into cent by (*100 )
  if (couponApplied && totalAfterDiscount) {
    finalAmount = Math.round(totalAfterDiscount * 100);
  } else {
    finalAmount = Math.round(cartTotal * 100);
  }

  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    // To display on the frontend
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
