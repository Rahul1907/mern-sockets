const mongoose = require("mongoose");
const connectionString = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@node-mongo-prac.tufq4i8.mongodb.net/?retryWrites=true&w=majority`;
console.log(connectionString);
const connectDB = (url = connectionString) => {
  return mongoose
    .connect(url, {
      //   useNewUrlParser: true,
      // useCreateIndex: true
    })
    .then(() => {
      console.log("Connected");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectDB;
