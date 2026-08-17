require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://13.60.214.251",
      "https://code-mate-frontend-nine.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database Connection is established!!");

    server.listen(process.env.PORT, () => {
      console.log(
        `Server is successfully connected to port ${process.env.PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
    console.error(err.message);
  });
