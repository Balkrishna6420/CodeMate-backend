const express = require("express");
const app = express();
app.get("/user", (req, res) => {
  res.send({ firstName: "BAlkrishna", lastNAme: "Jha" });
});
app.post("/user", (req, res) => {
  res.send("Data Saved in database successfully");
});
app.delete("/user", (req, res) => {
  res.send("Deleted Successfully");
});
app.use("/test", (req, res) => {
  res.send("Testing in my world");
});
app.listen(7777, () => {
  console.log("Server is successfully connected to port 7777");
});
