"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var createError = require("http-errors");
const express_1 = __importDefault(require("express"));
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
var app = (0, express_1.default)();
// view engine setup
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
}));
// app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/drivers", driversRouter);
app.use("/clients", clientsRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/reservations", reservationsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
