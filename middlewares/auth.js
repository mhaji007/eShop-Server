// Import admin tool
// admin tool is used in
// authenticating the token
// and accessing the user info
// retrieved from Firebase
const admin = require('../firebase');

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
