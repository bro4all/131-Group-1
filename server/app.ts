import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import { auth, book } from "server/routes";
import cors from "cors";

let app = express();

// mlab test one
const mongoUrl = "mongodb://admin:admin123@ds157544.mlab.com:57544/portfolio";
var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
mongoose
  .connect(
    mongoUrl,
    {
      promiseLibrary: require("bluebird"),
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("connection succesful"))
  .catch((err: any) => console.error(err));

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "dist")));

app.use("/api/book", book);
app.use("/api/auth", auth);

// Possible fix for rendering production version
app.get("*", function(req: any, res: any) {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // res.status(err.status || 500)
  // res.render('error')
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

export default app;
