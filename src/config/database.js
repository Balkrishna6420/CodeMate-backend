const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://bkrishnajha494:hjDJkSsv72EKExnb@balkrishna.7zf0t.mongodb.net/codeMate"
  );
};

module.exports= connectDB;
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
