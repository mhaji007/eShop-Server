const express = require('express');

const router = express.Router();

// Import middlewares
const {authCheck, adminCheck} = require('../middlewares/auth');

// Import controllers
const {create, read, update, remove, list} = require("../controllers/category");

  // Routes
  router.post('/category', authCheck, adminCheck, create);
  router.get('/categories', list);
  router.get('/category/:slug', authCheck, adminCheck, read);
  router.put('/category/:slug', authCheck, adminCheck, update);
  router.delete('/category/:slug', authCheck, adminCheck, remove);


  module.exports = router;


