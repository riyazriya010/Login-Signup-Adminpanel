const mongoose = require("mongoose"); //importnig mongoose module

const connect = mongoose.connect("mongodb://localhost:27017/login"); //creating connect with database

//checking db connected or not
connect
  .then(() => {
    console.log("Database connected successfully");
  })

  .catch(() => {
    console.log("Database cannot be connected");
  });

  module.exports=connect;
