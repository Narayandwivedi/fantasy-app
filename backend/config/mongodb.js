const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect(`${process.env.MONGO_URL}/winners11`);
  console.log("db connected");
  
}

module.exports = { connectToDb };
