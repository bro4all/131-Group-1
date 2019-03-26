"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _models = require("../models");

var _passport = _interopRequireDefault(require("passport"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
(0, _config.passport)(_passport.default);

var getToken = function getToken(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");

    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

router.get("/", _passport.default.authenticate("jwt", {
  session: false
}), function (req, res, next) {
  var token = getToken(req.headers);

  if (token) {
    _models.Book.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: "Unauthorized."
    });
  }
});
router.post("/", _passport.default.authenticate("jwt", {
  session: false
}), function (req, res, next) {
  var token = getToken(req.headers);

  if (token) {
    _models.Book.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({
      success: false,
      msg: "Unauthorized."
    });
  }
});
var _default = router;
exports.default = _default;