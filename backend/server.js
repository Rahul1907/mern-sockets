const express = require("express");
const dotenv = require("dotenv");
require("express-async-errors");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const errorHandlerMiddleware = require("./middleware/errorhandling");
const notFound = require("./middleware/not-found");

const app = express();
dotenv.config();

const connectDB = require("./db/connect");
const authRouts = require("./routes/authRoutes");
const userRouts = require("./routes/userRoutes");
const chatRouts = require("./routes/chatRoutes");
const messageRouts = require("./routes/messageRoutes");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use(errorHandlerMiddleware);
// app.use(notFound);

app.use(
  rateLimit({
    windowsMe: 15 * 30 * 1000,
    max: 100,
  })
);

app.use("/api/v1/auth", authRouts);
app.use("/api/v1", userRouts);
app.use("/api/v1/chat", chatRouts);
app.use("/api/v1/message", messageRouts);

let port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`Port running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
