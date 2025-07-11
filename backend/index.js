require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const { connectToDb } = require("./config/mongodb");
const upload = require("./config/multer")



// import routes
const playerRoute = require("./routes/playerRoute")
const matchRoute = require("./routes/matchRoute")
const teamRoute = require("./routes/teamRoute")
const userRoute = require("./routes/userRoute")

// imports

const {handlePlayerImgUpload , handleTeamImgUpload} = require("./controllers/uploadController")

// CORS configuration 
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "https://fantasy-app-73q4.vercel.app",
    "https://fantasy-backend-three.vercel.app"
  ],
  credentials: true
};

app.use(cors(corsOptions));


// Other middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))



// Routes
app.get("/", (req, res) => {
  res.send("api is working");
});



// upload images

app.use("/images", express.static("upload/images"));

// player image upload

app.post("/upload/player",upload.single("player"),handlePlayerImgUpload)

// team image upload

app.post("/upload/team", upload.single("team"), handleTeamImgUpload)




// use all routes

app.use("/api/players",playerRoute)
app.use("/api/teams",teamRoute)
app.use("/api/matches",matchRoute)
app.use("/api/users",userRoute)



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