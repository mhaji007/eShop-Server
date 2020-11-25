// Endpoint for Initializing stripe.
// This endpoint generates client secret
// based on Stripe's secret API key.
// This client secret is then sent back
// to the frontend to create and display the widget
// needed for taking in credit card details from the user

const express = require('express');
const router = express.Router();


const {createPaymentIntent} = require('../controllers/stripe')
const {route} = require("./user");

// Import middlewares
const {authCheck} = require("../middlewares/auth");

router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;

