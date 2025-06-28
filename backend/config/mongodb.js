const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect("mongodb+srv://desinplus1:n1n1n1n1@cluster0.9k3blpa.mongodb.net/winners11");
  console.log("db connected");
  
}

module.exports = { connectToDb };
