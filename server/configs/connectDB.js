const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
      console.log("Connected to Mongo DB");
    })
    .catch((err) => {
      console.error("Error connecting to Mongo DB:", err);
    });
};

module.exports = connectDB;
