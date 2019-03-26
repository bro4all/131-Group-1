"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _passportJwt = require("passport-jwt");

var _models = require("../models");

var _settings = _interopRequireDefault(require("./settings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// load up the user model
// get settings file
function _default(passport) {
  var opts = {};
  opts.jwtFromRequest = _passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = _settings.default.secret;
  passport.use(new _passportJwt.Strategy(opts, function (jwt_payload, done) {
    _models.User.findOne({
      id: jwt_payload.id
    }, function (err, user) {
      if (err) {
        return done(err, false);
      }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
}