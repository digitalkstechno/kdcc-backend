const express = require("express");
const router = express.Router();
const { 
  upsertPopup, 
  getPopupsByUser, 
  getActivePopup, 
  togglePopupStatus, 
  deletePopup 
} = require("../controller/popup");
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

router.post("/add", authMiddleware, upload.single("image"), upsertPopup);
router.get("/user/:userId", getPopupsByUser);
router.get("/active/:userId", getActivePopup);
router.put("/toggle/:id", authMiddleware, togglePopupStatus);
router.delete("/delete/:id", authMiddleware, deletePopup);

module.exports = router;
