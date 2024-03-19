const userCollection = require("../model/userModel");
const bcrypt = require("bcrypt");



// '/' login page render
const loginget = (req, res) => {
  // res.render("userPages/login");

  if (req.session.userVerify) {
    res.render("userPages/home", { userDetails: req.session.userDet });
  } else {
    res.render("userPages/login", {signUp: req.session.signup, exists: req.session.Exists, invalidPass: req.session.invalidPassword});
    req.session.signup = false;
    req.session.Exists = false;
    req.session.invalidPassword = false;
    req.session.save();
  }
};


// '/signup' page render
const signupget = (req, res) => {
  res.render("userPages/signup", {exists: req.session.userExists});
  req.session.userExists = false;
  req.session.save();
};


//functionality for the signup page
const signupVerify = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  };

  //checking if user is already exists in the database
  const existingUser = await userCollection.Collection.findOne({
    email: data.email,
  });

  if (existingUser) {
    // res.send("email already exists. Please choose a different email")
    req.session.userExists = true;
    res.redirect('/signup');

  } else {
    req.session.signup = true;
    //hash the password using bcrypt
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRound); //convert password to hashed

    data.password = hashedPassword; //Replace the hashed password with the original password

    //send the data to database
    const userdata = await userCollection.Collection.insertMany(data);

    // console.log(userdata); //logging data to check

    res.redirect("/");
  }
};

//login functionality
const loginVerify = async (req, res) => {
  try {
    //checking is user having account or not
    const userdata = await userCollection.Collection.findOne({
      email: req.body.email,
    });

    if (userdata) {
    
    const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        userdata.password
      );

      if (isPasswordMatch) {
        req.session.userVerify = true;
        req.session.userDet = userdata;
  
        res.redirect("/");

      }else {
        req.session.invalidPassword = true;
  
        res.redirect("/");
        
      }

    } else {
         req.session.Exists = true
         res.redirect('/')
      }
      
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const userLogout = (req, res) => {
  req.session.userVerify = false;
  req.session.userDet = null;

  res.redirect("/");
};

module.exports = { signupget, loginget, loginVerify, signupVerify, userLogout };
