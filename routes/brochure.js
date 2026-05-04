const express = require("express");
const router = express.Router();
const { addBrochure, getBrochuresByUserId, deleteBrochure } = require("../controller/brochure");
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

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

router.post("/add", authMiddleware, upload.single("brochure"), addBrochure);
router.get("/user/:userId", getBrochuresByUserId);
router.delete("/delete/:id", authMiddleware, deleteBrochure);

module.exports = router;
