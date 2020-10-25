// Import admin tool
// admin tool is used in
// authenticating the token
// and accessing the user info
// retrieved from Firebase
const admin = require('../firebase');
const User = require('../models/user');

// Recieve token in request headers
// on user log in from frontend
// check whether the token is valid
exports.authCheck = async (req, res, next) => {
  try {
    // console.log('Hey', req.headers.authtoken);

    // Verify token using firebase admin
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken)
    console.log('Firebase user in authCheck', firebaseUser);
    // Make user available in the createOrUpdate controller method
    // So it can be stored in the database
    // One way to make it available is by adding it
    // to the express's request object
    req.user = firebaseUser;
    next();

  } catch(err) {
    res.status(401).json({
      err: "Invalid or expired token"
    })
  }
}

// This funciton is an additional
// layer of security on top of authCheck
// for distinguishing admin users.
// Since authCheck middleware above
// runs first, by the time the code below runs
// we already have the user availabe on the
// req object
exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  // Find user in database based on the logged in user's email
  const adminUser = await User.findOne({ email }).exec();
  // If role is not admin, deny access
  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  // Otherwise grant access
    } else {
    next();
  }
};
