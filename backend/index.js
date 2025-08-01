require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const { connectToDb } = require("./config/mongodb");



// import routes
const uploadRoute = require("./routes/uploadRoute")
const searchRoute = require("./routes/searchRoute")
const playerRoute = require("./routes/playerRoute")
const matchRoute = require("./routes/matchRoute")
const teamRoute = require("./routes/teamRoute")
const userRoute = require("./routes/userRoute")
const authRoute = require("./routes/authRoute")
const contestRoute = require("./routes/contestRoute")
const userTeamRoute = require("./routes/userTeamRoute")



// CORS configuration 
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "https://fantasy-app-73q4.vercel.app",
    "https://fantasy-backend-three.vercel.app",
    "https://fantasybackend.winnersclubs.fun",
    "https://winners11.vercel.app"
  ],
  credentials: true
};

app.use(cors(corsOptions));


// Other middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/images", express.static("upload/images"));



// Routes
app.get("/", (req, res) => {
  res.send("api is working");
});




// use all routes

app.use("/api/upload",uploadRoute)

app.use("/api/search",searchRoute)

app.use("/api/players",playerRoute)

app.use("/api/teams",teamRoute)

app.use("/api/matches",matchRoute)

app.use("/api/users",userRoute)

app.use("/api/auth",authRoute)

app.use("/api/contests",contestRoute)

app.use("/api/userteam",userTeamRoute)



// Error handling middleware (add this)
app.use((err, req, res, next) => {
   console.error("Error:", err);
  res.status(500).json({ message: 'Internal server error' });
});

// DB and server connection
connectToDb()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("server connected");
    });
  })
  .catch((err) => {
    console.log("db error", err);
  });