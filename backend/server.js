const express = require("express");
const dotenv = require("dotenv");
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();
dotenv.config();

const connectDB = require("./db/connect");

app.use(express.json());

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(
  rateLimit({
    windowsMe: 15 * 30 * 1000,
    max: 100,
  })
);
let port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`Port runing on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
