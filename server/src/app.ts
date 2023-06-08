var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import { NextFunction, Request, Response } from "express";
import {
  ResponseWithSocket,
  SocketWithAccessToken,
} from "./interfaces/auth.interface";
import { route } from "./routes/index";
var app = express();
var mongoose = require("mongoose");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("dotenv").config();
const { MONGODB_URL, MONGODB_URL_SHARDING } = process.env;
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));
mongoose.set({
  strictQuery: false,
});
mongoose
  .connect(MONGODB_URL_SHARDING)
  .then(console.log("Connected"))
  .catch((err: any) => console.log("don't connect"));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization,set-cookie, Accept,X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,PATCH"
  );

  // res.header("Access-Control-Expose-Headers", "set-cookie");
  res.header("Access-Control-Expose-Headers", "*");
  next();
});

io.use((socket: SocketWithAccessToken, next: NextFunction) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) return next(new Error("invalid accessToken"));
  socket.userId = userId;
  next();
});
io.on("connect", (socket: SocketWithAccessToken) => {
  console.log(`user ${socket.userId} connected`);
  socket.on("disconnect", () => {
    console.log(`user ${socket.userId} disconnected`);
  });
});
app.use((req: Request, res: ResponseWithSocket, next: NextFunction) => {
  res.io = io;
  next();
});

route(app);

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
  // res.render('error')
});
server.listen(3000, () =>
  console.log("Server ready at: http://localhost:3000")
);

module.exports = app;
