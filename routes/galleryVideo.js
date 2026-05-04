const express = require("express");
const router = express.Router();
const { addVideos, getVideosByUserId, deleteVideo } = require("../controller/galleryVideo");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/builder");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/add", authMiddleware, upload.array("videos", 5), addVideos);
router.get("/user/:userId", getVideosByUserId);
router.delete("/delete/:id", authMiddleware, deleteVideo);

module.exports = router;
