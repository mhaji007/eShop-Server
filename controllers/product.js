const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    // Make sure data is received from the frontend
    console.log(req.body);
    // Create a slug based on the title. Add slug to the request body
    req.body.slug = slugify(req.body.title);
    // Create new product
    // (all necessary information is avaialble on the request body now)
    // save created product in the database
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log("Product create error --->", err);
    res.status(400).send("Create product failed");

    // // Send specific message from mongoose
    // res.status(400).json({
    //   err:err.message
    // })
  }
};

// exports.read = async (req, res) => {
//   try {
//     // Make sure data is received from the frontend
//     console.log(req.body);
//     // let products = await Product.find({}).populate('category');
//     let products = await Product.find({});
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(products);
  } catch (err) {
    console.log("Product listAll error --->", err);
    return res.status(400).send("Product listAll failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log("Product remove error --->", err);
    return res.status(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate("category")
      .populate("subs")
      .exec();
    res.json(product);
  } catch (err) {
    console.log("Product read error --->", err);
    return res.status(400).send("Product read failed");
  }
};

exports.update = async (req, res) => {
  // Updates slug
  // If user navigates to previous slug
  // encounters page not found
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log("Product Update error --->", err);
    return res.status(400).send("Product update failed");
  }
};

// // List new arrivals without pagination
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;

//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log("Product list error --->", err);
//     return res.status(400).send("Product list failed");
//   }
// };

// List new arrivals with pagination
exports.list = async (req, res) => {
  try {
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    // How many products per page
    const perPage = 3;
    // For example request coming in from frontend for page 3
    // we need to skip 6 products
    // (two pages, each containing 3 products ) and
    // start form 7 onwards
    const products = await Product.find({})
      // Each time based on the page number
      // skip the previous page
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log("Product listAll error --->", err);
    return res.status(400).send("Product listAll failed");
  }
};

// Find total number of documents (products)
exports.productsCount = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount().exec();

    res.json(total);
  } catch (err) {
    console.log("Products count error --->", err);
    return res.status(400).send("Products count failed");
  }
};

exports.productStar = async (req, res) => {
  // Find product based on the route parameter
  const product = await Product.findById(req.params.productId).exec();
  // Logged in user who will be adding or updating the rating
  // Find user based on user's email (authCheck middleware makes sure user is available from firebase on req.user)
  const user = await User.findOne({ email: req.user.email }).exec();
  // Destructuring rating number received from frontend
  const { star } = req.body;

  // Determine who is doing the update/add
  // Check if currently logged in user have already added rating to this product?
  // If yes, update. If no, add
  // Access ratings array of the product
  // and apply the find method
  let existingRatingObject = product.ratings.find(
    // Each element here is a rating object
    // {star: Number, postedBy:{type: ObjectID, ref:"User"}}
    // Check whether any of these objects have a postedBy
    // (reference to userId) that is same as id of the user
    // that is currenlty logged in (derived above)

    // ele.postedBy === user._id won't work
    // because of strict mongoose Id
    // So we either have to use ==
    // or === with toString() as below
    (ele) => ele.postedBy.toString() === user._id.toString()
  );
  // If the currenlty logged in user haven't left a rating yet
  // (existingRatingObject is and empty object - undefined), push
  // the new rating to the ratings array (do not replaced the entire array)
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      // First argument (which product)
      product._id,
      // Second argument (which property to be updated)
      {
        // Object syntax for pushing to ratings array
        // this object has a star and posteBy which
        // is the already logged-in user Id
        $push: { ratings: { star, postedBy: user._id } },
      },
      // Third argument
      // Necessary for returning the updated rating information in json format
      { new: true }
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    // if the user has already left a rating,
    // update the rating array.
    // What we need to do here is to not only
    // find the product model but also one of the
    // nested properties (here product.ratings) and
    // then update one of the matching objects
    // withing the product.ratings
    const ratingUpdated = await Product.updateOne(
      {
        // Find the existing matching object
        // find in ratings array the element that
        // we want to match which is the existing
        // rating object. This existing rating object
        // has a ratings property (star) and posteBy
        ratings: { $elemMatch: existingRatingObject },
      },
      // At this point we have found the element
      // we want to update
      // we only need to update the ratings
      // property for the matching object
      { $set: { "ratings.$.star": star } },
      // Necessary for returning the updated rating information in json format
      { new: true }
    ).exec();
    console.log("ratingUpdated", ratingUpdated);
    res.json(ratingUpdated);
  }
};

// Find related products based on category
// excluding the product itseld
exports.listRelated = async (req, res) => {
  // Find product
  const product = await Product.findById(req.params.productId).exec();
  // Find product excluding the current product
  // find method can take more than one argument
  const related = await Product.find({
    // this alone is not enough
    _id: { $ne: product._id },
    // All the products that has the same category
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    // This returns all of
    // user's information
    .populate("postedBy")
    // or you can be more selective
    // by including just specific fields
    // .populate("postedBy", "_id name")
    // Not sending a field
    // .populate("postedBy", "_password")

    .exec();

  res.json(related);
};

// Search

// Handle search query
// If user's text input matches those
// in title or description of a product
// send back that product as json response
const handleQuery = async (req, res, query) => {
  // Text-based search
  // In product model for title and description fields
  // the property text: true was added to facilitate search by text
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

// Hanle price range

// Price will be coming in
// in the form of an array (e.g., [20, 50])
// Send back all the prices that are
// in between the range
const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        // Should be greater than first value
        $gte: price[0],
        // Should be less than second value
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
// Handle category
// Categories will be coming in in the form
// of an array of non-duplicate values after
// user clicks on any of the checkboxes in Shop page
const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleStar = (req, res, stars) => {
  // Utilize project aggregation
  // Pass along the documents with the
  // requested fields to the next stage
  // in the pipeline
  // Since ratings field in the product model
  // is not structured the same as other fields
  // (there could be many different ratings from
  // many different people), there is a neeed to
  // aggregate another project
  Product.aggregate([
    {
      $project: {
        // Fields from the input document (title, description, slug, etc.)
        // document: "$$ROOT" is a special method that grants
        // access to the entire project document
        // otherwise all fields were to be added like
        // below and then add the averageRating
        // filed at the end

        // title:"$title",
        // description:"$description",
        //...
        // averageRating: ...

        document: "$$ROOT",
        // Newly computed field
        floorAverage: {
          $floor: {
            $avg: "$ratings.star",
          },
        },
      },
    },
    // Check if the star clicked on by the user
    // is equal to the average of
    // all the stars
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      // Instead of using async await
      // exec with a call back funciton is used
      if (err) console.log("Aggregate error", err);
      // Since a new project is generated
      // Product.find is applied here in the aggergate
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("Product aggregate error");
          res.json(products);
        });
    });
};

const handleSubcategory = async (req, res, subcategory) => {
  const products = await Product.find({ subs: subcategory })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  // Destructure search query from body
  // search term is sent in from frontend
  // in the form of { query: text } in the body
  const { query, price, category, stars, subcategory } = req.body;

  if (query) {
    console.log("query  ---> ", query);
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    console.log("price  ---> ", price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log("category ---> ", category);
    await handleCategory(req, res, category);
  }
  if (stars) {
    console.log("stars ---> ", stars);
    await handleStar(req, res, stars);
  }
  if (subcategory) {
    console.log("stars ---> ", subcategory);
    await handleSubcategory(req, res, subcategory);
  }
};
