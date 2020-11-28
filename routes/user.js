const express = require("express");

const router = express.Router();

// Import middlewares
const { authCheck } = require("../middlewares/auth");
// Import controllers
const {
  userCart,
  getUserCart,
  emptyUserCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
} = require("../controllers/user");

// Save cart
router.post("/user/cart", authCheck, userCart);
// Get cart
router.get("/user/cart", authCheck, getUserCart);
// Empty cart
router.delete("/user/cart", authCheck, emptyUserCart);
// Save user's address
router.post("/user/address", authCheck, saveAddress);

// Create order
router.post("/user/order", authCheck, createOrder);
// Get orders
router.get("/user/orders", authCheck, orders);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

// Apply coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

// Wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
