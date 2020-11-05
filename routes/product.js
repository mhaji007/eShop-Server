const express = require("express");
const router = express.Router();

// Import middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// Import controllers
const { create, listAll , remove} = require("../controllers/product");

// Routes
router.post("/product", authCheck, adminCheck, create);

// products/100
router.get("/products/:count", listAll);
// router.get("/products", read);

router.delete("/product/:slug", authCheck, adminCheck, remove);

module.exports = router;
