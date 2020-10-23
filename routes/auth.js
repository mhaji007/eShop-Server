const express = require('express');

const router = express.Router();

// Import middlewares
const {authCheck} = require('../middlewares/auth');

// Import controllers
const {createOrUpdateUser} = require("../controllers/auth");

  // Routes

  // Receieves token from the frontend
  // But first we need to make sure the
  // token is valid via middleware (authCheck)
  router.post('/create-or-update-user', authCheck, createOrUpdateUser);

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
