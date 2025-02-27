const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");


app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("something went wrong");
  }
});

app.get("/getUserData", (req, res) => {
  try {
  //Logic of DB call and get user data
  throw new Error("dvbzhjf");
  res.send("User Data Sent");
    } catch (err) {
      res.status(500).send("Some Error contact support team");
    }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Server is successfully connected to port 7777");
});
