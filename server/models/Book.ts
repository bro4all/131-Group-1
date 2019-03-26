import mongoose from "mongoose";

var BookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String,
  description: String,
  published_date: { type: Date },
  publisher: String,
  updated_date: { type: Date, default: Date.now },
});

var AccountSchema = new mongoose.Schema({
  name: String,
  balance: 
})

export default mongoose.model("Book", BookSchema);
