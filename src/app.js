const express = require("express");
const app = express();
app.use("/", (req, res) => {
  res.send("Welocome to my dashboard");
});
app.use("/hello", (req, res) => {
  res.send("Helo to my world");
});
app.use("/test", (req, res) => {
  res.send("Testing in my world");
});
app.listen(7777, () => {
  console.log("Server is successfully connected to port 7777");
});
