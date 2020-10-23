// Bring in user model
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
  // Find user based on email {email:email} and update name and picture
  // {new:true} returns updated user information / prevents returning the
  // older information
  const user = await User.findOneAndUpdate(
    { email },
    { name, picture },
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
  } else {
    const newUser = await new User({
      email,
      name,
      picture,
    }).save();
    console.log("User Created", newUser);
    res.json(newUser);
  }
};
