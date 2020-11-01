const express = require("express");
const router = express.Router();

// Import middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// Import controllers
const { create, read } = require("../controllers/product");

// Routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products", read);

module.exports = router;
