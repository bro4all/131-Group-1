"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _routes = require("./routes");

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)(); // mlab test one

var mongoUrl = "mongodb://admin:admin123@ds157544.mlab.com:57544/portfolio";

var mongoose = require("mongoose");

mongoose.Promise = require("bluebird");
mongoose.connect(mongoUrl, {
  promiseLibrary: require("bluebird"),
  useNewUrlParser: true,
  useCreateIndex: true
}).then(function () {
  return console.log("connection succesful");
}).catch(function (err) {
  return console.error(err);
});
app.use((0, _morgan.default)("dev"));
app.use((0, _cors.default)());
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use(_express.default.static(_path.default.join(__dirname, "..", "dist")));
app.use("/api/book", _routes.book);
app.use("/api/auth", _routes.auth); // Possible fix for rendering production version

app.get("*", function (req, res) {
  res.sendFile(_path.default.resolve(__dirname, "..", "dist", "index.html"));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page
  // res.status(err.status || 500)
  // res.render('error')

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});
var _default = app;
exports.default = _default;