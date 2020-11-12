const express = require("express");
const router = express.Router();

// Import middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// Import controllers
const {
  create,
  list,
  listAll,
  remove,
  read,
  update,
  productsCount,
  productStar
} = require("../controllers/product");

// Routes
router.post("/product", authCheck, adminCheck, create);

// Return total number of documents (products)
// Moved to the top as sometimes route parameters
// interfere with the request
router.get("/products/total", productsCount);

// products/100
router.get("/products/:count", listAll);
// router.get("/products", read);


router.delete("/product/:slug", authCheck, adminCheck, remove);

// Return a single product
// Used both by the admin (when prepoulating
// the product's data on edit page)
// and the regular user (when navigating
// to the detail page)
router.get("/product/:slug", read);

// Return the updated product
router.put("/product/:slug", authCheck, adminCheck, update);

// Return new arriavls (recently created products)

// Post request is used
// because send parameters (e.g., for sorting) inside body
// is easier
router.post("/products", list);

// Rating route
// Find product based on the product id
// Put request since we are updating the rating
router.put("/product/star/:productId", authCheck, productStar);

module.exports = router;
