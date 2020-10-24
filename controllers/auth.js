// Bring in the user model
const User = require("../models/user");

// Create or update user information based on verification
// Obtained from running authCheck middleware
// which in turn utliizes firebase admin
// user info is available on the user
// because of the authCheck middleware
exports.createOrUpdateUser = async (req, res) => {
  // authCheck middleware runs first
  // Destructure values from autCheck
  const { name, picture, email } = req.user;
  // If user already exits in the database, update
  // find user based on email {email:req.user.email} and update name and picture
  // {new:true} returns updated user information / prevents returning the
  // older information
  // If user is not found create the user
  // Extract the first part of the email
  // and use it as the username
  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], picture },
    { new: true }
  );

  // res.json({
  //   data: "You hit the create-or-update-user API end point of eShop"
  // })

  // If update was successful, true is returned

  if (user) {
    console.log("User updated", user);
    res.json(user);
    // If user is not found create the user
    // Extract the first part of the email
    // and use it as the username
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture,
    }).save();
    console.log("User Created", newUser);
    res.json(newUser);
  }
};

// Get current user's information
exports.currentUser = async (req, res) => {
  // user is made available on the req object
  // throught the authCheck middleware
  // find user based on email {email:req.user.email}
  User.findOne({email: req.user.email}).exec((err, user) => {
    if(err) throw new Error(err);
    res.json(user);
  })
}
