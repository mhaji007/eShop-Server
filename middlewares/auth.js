// Import admin tool
const admin = require('../firebase');

// Check whether the token is valid
exports.authCheck = (req, res, next) => {
  console.log(req.headers);
  next();
}
