const userCollection = require("../model/userModel");
const bcrypt = require("bcrypt");

//rendering to admin page
const adminget = async (req, res) => {
  // res.render("adminPages/adminLogin")
  if (req.session.logged) {
    if (req.session.search) {
      res.render("adminPages/adminHome", { userdetails: req.session.search });
      req.session.search = false;
      return req.session.save();
    }

    const userData = await userCollection.Collection.find();
    res.render("adminPages/adminHome", { userdetails: userData });
    req.session.userAdd = false;
  } else {
    res.render("adminPages/adminLogin", { invalid: req.session.invalid });
    req.session.invalid = false;
    req.session.save();
  }
};

//Adminfunctionality
const adminVerify = async (req, res) => {
  try {
    // console.log('XXXX:',process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD)
    // console.log(req.body.email,req.body.password)

    if (
      req.body.email === process.env.ADMIN_EMAIL &&
      req.body.password === process.env.ADMIN_PASSWORD
    ) {
      req.session.logged = true;
      res.redirect("/adminLogin");
      // res.render('adminPages/adminHome')
    } else {
      req.session.invalid = true;
      res.redirect("/adminLogin");
      // res.send('wrong details');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Intenal Server Error");
  }
};

//AdminLogout
const adminLogout = async (req, res) => {
  try {
    req.session.logged = false;
    res.redirect("/adminLogin");
  } catch (error) {
    console.error(error);
  }
};

//addUser
const addUser = async (req, res) => {
  console.log(req.body);
  try {
    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new userCollection.Collection({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: encryptedPassword,
    });

    const checkAdduser = await userCollection.Collection.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (checkAdduser) {
      res.status(208).send({ emailExists: true });
    } else {
      req.session.userAdd = true;
      newUser.save();
      res.status(200).send({ success: true });
    }
  } catch (error) {
    console.error(error);
  }
};

//UserDelete
const userDelete = async (req, res) => {
  try {
    await userCollection.Collection.deleteOne({ _id: req.params.id });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
  }
};

//UserSearch
const userSearch = async (req, res) => {
  try {
    const searchedUsers = await userCollection.Collection.find({
      name: { $regex: req.body.search, $options: "i" },
    });
    req.session.search = searchedUsers;
    res.redirect("/adminLogin");
  } catch (error) {
    console.error(error);
  }
};

//editUser
const editUser = async (req, res) => {
  try {
    const details = await userCollection.Collection.findById({
      _id: req.params.id,
    });
    res.render("adminpages/adminEdit", { details });
  } catch (error) {
    console.log(error);
  }
};

//updateUser
const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userCheck = await userCollection.Collection.findOne({
      $or: [{ email }, { phone }],
    });
    if (userCheck && req.params.id != userCheck._id) {
      res.send({ mailexists: true });
    } else {
      await userCollection.Collection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { name, email, phone } }
      );
      res.send({ success: true });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  adminget,
  adminVerify,
  adminLogout,
  addUser,
  userDelete,
  userSearch,
  editUser,
  updateUser,
};
