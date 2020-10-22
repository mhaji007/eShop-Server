const express = require('express');

const router = express.Router();

// Import controllers
const {createOrUpdateUser} = require("../controllers/auth");

  // Routes
  router.get('/create-or-update-user', createOrUpdateUser);

  // Export router so
  // it can be used in the server.js
  // This is similar to default export
  // in that when importing the naming
  // is flexible
  module.exports = router;

  // Compare with:
  // exports.createOrUpdateUser = (req, res) => {
  //   res.json({
  //     data: "You hit the create-or-update-user API end point of eShop"
  //   })
  // }
  // which acts similar to name exports
  // and therefore should be importedd as such
