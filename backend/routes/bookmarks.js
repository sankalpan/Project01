const express = require("express");
const router = express.Router();
const { addBookmark, getBookmarks, deleteBookmark } = require("../controllers/bookmarkController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, addBookmark);
router.get("/", auth, getBookmarks);
router.delete("/:id", auth, deleteBookmark);

module.exports = router;