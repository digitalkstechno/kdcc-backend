const express = require("express");
const router = express.Router();
const { 
  addAdvertisement, 
  getAdvertisementsByUserId, 
  updateAdvertisementType, 
  deleteAdvertisement 
} = require("../controller/advertisement");
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

router.post("/add", authMiddleware, upload.array("images", 10), addAdvertisement);
router.get("/user/:userId", getAdvertisementsByUserId);
router.put("/update-type/:id", authMiddleware, updateAdvertisementType);
router.delete("/delete/:id", authMiddleware, deleteAdvertisement);

module.exports = router;
