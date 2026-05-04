const express = require("express");
const router = express.Router();
const dropboxController = require("../controller/dropbox");
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

router.post("/", upload.array("images", 10), dropboxController.create);
router.get("/", dropboxController.getAll);
router.delete("/:id", dropboxController.delete);

module.exports = router;
