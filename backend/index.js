require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectToDb } = require("./config/mongodb");

const app = express();

// CORS configuration - MUST be first
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "https://fantasy-app-73q4.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Other middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("api is working");
});

const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", adminRoute);

// Error handling middleware (add this)
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
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