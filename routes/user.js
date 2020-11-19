const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");
// controllers
const { userCart } = require("../controllers/user");

// Save cart
router.post("/cart", authCheck, userCart);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
