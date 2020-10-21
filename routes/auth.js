const express = require('express');

const router = express.Router();


  // Routes
  router.get('/create-or-update-user', (req,res) => {
    res.json({
      data:"You hit eShop's create-or-update API endpoint"
    });
  });

  module.exports = router;
