require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectToDb } = require("./config/mongodb");

const app = express();

// imports routes

const adminRoute = require("./routes/adminRoute");

// middleware

// parse json data
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://fantasy-admin-panel.vercel.app",
      "https://fanatasy-admin-panel.vercel.app" // keep both spellings
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("api is working");
});

app.use("/api/admin", adminRoute);

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
