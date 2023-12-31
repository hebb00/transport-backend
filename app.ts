var createError = require("http-errors");
import express, {Application, Request, Response,NextFunction} from "express";
// var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var driversRouter = require("./routes/drivers");
var clientsRouter = require("./routes/clients");
var vehiclesRouter = require("./routes/vehicles");
var reservationsRouter = require("./routes/reservations");


var app:Application = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/drivers", driversRouter);
app.use("/clients",clientsRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/reservations", reservationsRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err:any, req: Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
