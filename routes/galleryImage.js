const express = require("express");
const router = express.Router();
const { addImages, getImagesByUserId, deleteImage } = require("../controller/galleryImage");
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

router.post("/add", authMiddleware, upload.array("images", 10), addImages);
router.get("/user/:userId", getImagesByUserId);
router.delete("/delete/:id", authMiddleware, deleteImage);

module.exports = router;
