const Bookmark = require("../models/Bookmark");

exports.addBookmark = async (req, res) => {
  const bookmark = new Bookmark({ ...req.body, user: req.user.id });
  await bookmark.save();
  res.json(bookmark);
};

exports.getBookmarks = async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user.id });
  res.json(bookmarks);
};

exports.deleteBookmark = async (req, res) => {
  await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.send("Deleted");
};