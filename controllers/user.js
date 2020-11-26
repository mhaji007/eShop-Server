const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

// Receive request from frontend
// add additional fields received from
// the frontend and create a new product
// for each product in the cart
// create a new cart and save
// it to the databsae
exports.userCart = async (req, res) => {
  // console.log(req.body); // {cart: []}

  // Destructure cart from frontend request body
  const { cart } = req.body;

  // Each product will have fields that are
  // not in the orginal product model (e.g., count, color)
  // and are received from the frontend upon user's
  // interaction with the product cart.
  // Therefore there is a need to create a new products array,
  // then loop through all the products in the cart
  // received from the frontend and add these new fields
  // to a new object and finally push this object,
  // containing all the original and added fields, to the products array
  let products = [];

  // Determine the logged in user
  const user = await User.findOne({ email: req.user.email }).exec();

  // Check if cart with logged in user id already exists
  // If user has already had a cart with items and is coming back again
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();
  // Remove the existing cart and start fresh
  // so there are no duplicates.
  // Each user will only have one cart
  if (cartExistByThisUser) {
    cartExistByThisUser.remove();
    console.log("removed old cart");
  }
  // Loop through each product in the cart
  for (let i = 0; i < cart.length; i++) {
    // As we loop, push product properties to this object
    // and finally push this object to products array
    let object = {};

    // Product in database
    // cart[i].id equals product._id (i.e., the whole
    // product object in the database) for each product
    // that is being iterated over
    object.product = cart[i]._id;
    // Add additional fields
    // added by the user
    object.count = cart[i].count;
    object.color = cart[i].color;

    // Calculate price based on information
    // from the database without relying on the frontend data
    // The reson we are finding this product by
    // querying the database and not relying on the data
    // received from frontend is because on the frontend
    // the values are stored in the local storage and then sent
    // back. Therefore they could have easily been compromised

    // findbyId returns the whole object
    // select, selects the specified field
    let productFromDB = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    object.price = productFromDB.price;

    // Push the new object to the products array
    products.push(object);
    console.log("new products =====> ", products);
  }

  exports.getUserCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price totalAfterDiscount")
      .exec();

    // console.log("new cart =====> ", cart)
    // console.log("products destructured ========> ", JSON,stringify(cart.products, null , 4 ))

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
  };

  // console.log('products', products)

  // Calculate cart total
  let cartTotal = 0;
  // Loop this time through the new products array
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  // console.log("cartTotal", cartTotal);

  // Create a new cart with all the
  // added fields and save it to the database
  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  console.log("new cart", newCart);
  // Redirect user to the checkout page
  // based on the ok response
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    // Populate the nested product fields
    // Choose the desired fields
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();
  // Break down the large object
  // Now instead of req.data.cart.poducts
  // if we  had used res.json(cart)
  // we can use req.data.products

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyUserCart = async (req, res) => {
  console.log("empty cart");
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("COUPON", coupon);

  // Check for valid coupon
  // Send in name received and destructured from frontend on req.body
  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.json({
      err: "Invalid coupon",
    });
  }
  console.log("VALID COUPON", validCoupon);

  // Retrieve logged in user
  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } =
    // Retrieve cart belogning to the logged in user
    await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // Calculate the total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  // Update logged in user's cart with the new totl
  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  // Retrieve paymnet intent from the frontend
  const paymentIntent = req.body.stripeResponse;
  // Retrieve current user
  // The reson we need the user here
  // is we need to grab user's cart
  // because each order is basically a cart item
  // Now we need to save cart items as order and afterwards empty the card
  const user = await User.findOne({ email: req.user.email }.exec());

  // Find the user's cart based on the id (retrieve all the products
  // ordered based on user id)
  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  // Create a new order
  let newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();
  console.log(" New order saved", newOrder);
  res.json({ ok: true });
};
