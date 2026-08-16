const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("Database Connection is established!!");
  } catch (err) {
    console.error("Database cannot be connected!!");
    console.error(err.message);
    throw err;
  }
};

module.exports = connectDB;