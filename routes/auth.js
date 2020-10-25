const express = require('express');

const router = express.Router();

// Import middlewares
const {authCheck, adminCheck} = require('../middlewares/auth');

// Import controllers
const {createOrUpdateUser, currentUser} = require("../controllers/auth");

  // Routes

  // Receieves token from the frontend
  // But first we need to make sure the
  // token is valid via middleware (authCheck)
  router.post('/create-or-update-user', authCheck, createOrUpdateUser);
  // get request could also be used here
  // but since get request is easier to make (e.g., directly through browser)
  // as opposed to post (which should be made programmatically)
  // post is used
  router.post('/current-user', authCheck, currentUser);
  // Protected admin route
  router.post('/current-user', authCheck, adminCheck, currentUser);

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
