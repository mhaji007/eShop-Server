const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const {readdirSync} = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/auth");

// Express server app
const app = express();

// Connect to Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to the Database"))
  .catch((err) => console.log("Database connection error", err));

// Global middlewares (to be used on all routes)
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// Routes middleware
// Route autoloading - dynamically import
// same as:
// const authRoutes = require("./routes/auth");
// routes app.use("/api", authRoutes);
readdirSync('./routes').map((r)=> app.use("/api", require("./routes/" + r)))

// Port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
