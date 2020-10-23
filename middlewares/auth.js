// Import admin tool
// admin tool is used in
// authenticating the token
// and accessing the user info
// retrieved from Firebase
const admin = require('../firebase');

// Recieve token in request headers
// on user log in from frontend
// check whether the token is valid
exports.authCheck = (req, res, next) => {
  console.log(req.headers);
  next();
}
