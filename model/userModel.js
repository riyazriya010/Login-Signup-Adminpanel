const mongoose = require('mongoose');
// const Connect = require('../config/dbConnect')

//creating a schema
const LoginSchema = new mongoose.Schema({

    name: {
      type: String,
      required:true
    },
    
    password: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required:true
    },
    phone: {
      type: String,
      required:true
    }
  
  });
  
  //Collection part (Model)
  const Collection = new mongoose.model("users", LoginSchema);
  
  module.exports = {Collection};
  