const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  author: String,
  date: String,
  source: String
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);