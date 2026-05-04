const express = require("express");
const router = express.Router();
const {
  addAboutSection,
  getAboutSectionsByUserId,
  deleteAboutSection,
  updateAboutSection,
} = require("../controller/aboutSection");
const authMiddleware = require("../middleware/auth");
const createUploader = require("../utils/multer");
const upload = createUploader("builder");

// Protected route to add
router.post("/add", authMiddleware, upload.single("image"), addAboutSection);

// Public route to get
router.get("/user/:userId", getAboutSectionsByUserId);

// Protected route to delete
router.delete("/delete/:id", authMiddleware, deleteAboutSection);

// Protected route to update
router.put("/update/:id", authMiddleware, upload.single("image"), updateAboutSection);

module.exports = router;
