const express = require("express");
const router = express.Router();

// Import middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// Import controllers
const { create } = require("../controllers/product");

// Routes
router.post("/product", authCheck, adminCheck, create);

module.exports = router;
