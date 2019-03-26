"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptNodejs = _interopRequireDefault(require("bcrypt-nodejs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
UserSchema.pre("save", function (next) {
  var user = this;

  if (this.isModified("password") || this.isNew) {
    _bcryptNodejs.default.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }

      _bcryptNodejs.default.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  _bcryptNodejs.default.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

var _default = (0, _mongoose.model)("User", UserSchema);

exports.default = _default;