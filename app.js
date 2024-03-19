const express = require("express");
const session = require("express-session");
const path = require("path");
const userRouter = require("./routes/userRoute.js");
const adminRouter = require("./routes/adminRoute.js");

//connecting db
require('./config/dbConnect.js')

// const bcrypt = require("bcrypt"); //for hashing password
// const {Collection,Connect} = require("./model/userModel")

const PORT = 5001;

//requiring dotenv
require("dotenv").config();

//creating an express application
const app = express();

//convert data in json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting ejs as view engine
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//session setting
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(userRouter);
app.use(adminRouter);

//static folder link
app.use(express.static("public"));

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port: ${PORT}`);
});
