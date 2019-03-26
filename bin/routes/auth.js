"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _config = require("../config");

var _express = require("express");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _models = require("../models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
(0, _config.passport)(_passport.default);
router.post("/register", function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({
      success: false,
      msg: "Please pass username and password."
    });
  } else {
    var newUser = new _models.User({
      username: req.body.username,
      password: req.body.password
    }); // save the user

    newUser.save(function (err) {
      if (err) {
        return res.json({
          success: false,
          msg: "Username already exists."
        });
      }

      res.json({
        success: true,
        msg: "Successful created new user."
      });
    });
  }
});
router.post("/login", function (req, res) {
  _models.User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({
        success: false,
        msg: "Authentication failed. User not found."
      });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = _jsonwebtoken.default.sign(user.toJSON(), _config.settings.secret); // return the information including token as JSON


          res.json({
            success: true,
            token: "JWT " + token
          });
        } else {
          res.status(401).send({
            success: false,
            msg: "Authentication failed. Wrong password."
          });
        }
      });
    }
  });
});
var _default = router;
exports.default = _default;