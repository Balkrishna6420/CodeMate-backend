const mongoose = require("mongoose");
const connectDB = async () => {
  // console.log(process.env.DB_CONNECTION_SECRET);
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;
// connectDB()
//   .then(() => {
//     console.log("Database Connection is established!!");
//   })
//   .catch((err) => {
//     console.log("Database cannot be connected!!");
//   });
// mongoose.connect(
//   "mongodb+srv://bkrishnajha494:<db_password>@balkrishna.7zf0t.mongodb.net/"
// );
