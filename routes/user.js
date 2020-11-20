const express = require("express");

const router = express.Router();

// Import middlewares
const { authCheck } = require("../middlewares/auth");
// Import controllers
const { userCart, getUserCart, emptyUserCart, saveAddress } = require("../controllers/user");

// Save cart
router.post("/user/cart", authCheck, userCart);
// Get cart
router.get("/user/cart", authCheck, getUserCart);
// Empty cart
router.delete("/user/cart", authCheck, emptyUserCart);
// Save user's address
router.post("/user/address", authCheck, saveAddress);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
