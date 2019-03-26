"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BookSchema = new _mongoose.default.Schema({
  isbn: String,
  title: String,
  author: String,
  description: String,
  published_date: {
    type: Date
  },
  publisher: String,
  updated_date: {
    type: Date,
    default: Date.now
  }
});

var _default = _mongoose.default.model("Book", BookSchema);

exports.default = _default;