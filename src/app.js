const express = require("express");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  app.use(cors(corsOptions));
  app.use(helmet());
//   app.use(xss());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(express.static("public"));
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many Requests from this IP , try again later",
  });
  
  app.use(limiter);

// Routes
const authRoutes = require("./routes/auth.routes.js");


app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;