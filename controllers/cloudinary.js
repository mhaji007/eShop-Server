const cloudinary = require("cloudinary");

// Cloudinary config
// enables using env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Endpoint for uploading images to cloudinary

exports.upload = async (req, res) => {
  // cloudinary.uploadder.upload is available via cloudinary package
  // Since we are using binary data (json) and not form data
  // image is accessed via req.body.image
  // If form data was used, image could be accessed via
  // req.files.file.path
  // result contains the uploaded image url
  try {
    let result = await cloudinary.uploader.upload(req.body.image, {
      // Publicly visible id
      public_id: `${Date.now()}`,
      // Automatically use image format as resource type
      // e.g., jpeg, png, etc.
      resource_type: "auto",
    });
    // Send image url from cloudinary to the frontend
    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    console.log("Cloudinary upload error --->", err);
    return res.status(400).send("Cloudinary upload failed");
  }
};

// Endpoint for removing images

exports.remove = (req, res) => {
  // Send image id as the identifier
  // of which image is to be deleted
  try {
    let image_id = req.body.public_id;

    cloudinary.uploader.destroy(image_id, (err, result) => {
      if (err) return res.json({ success: false, err });
      // res.status(200).send("ok")
      // status 200 is the default status
      // and here could be done away with
      res.send("ok");
    });
  } catch (err) {
    console.log("Cloudinary remove error --->", err);
    return res.status(400).send("Cloudinary remove failed");
  }
};
