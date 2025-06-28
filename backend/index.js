require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser') 
const cors = require('cors')

const { connectToDb } = require("./config/mongodb");

const app = express();

// imports routes

const adminRoute = require("./routes/adminRoute")

// middleware

// parse json data
app.use(cors({
     origin: ["http://localhost:5173"],
     credentials:true
}))
app.use(express.json())
app.use(cookieParser())



app.get("/",(req,res)=>{
  res.send("api is working")
})

app.use("/api/admin",adminRoute)

// db and server connection

connectToDb()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("server connected");
    });
  })
  .catch((err) => {
    console.log("db error");
  });
