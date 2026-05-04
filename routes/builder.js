const express = require("express");
const router = express.Router();
const {
  fetchAllBuilders,
  updateBuilder,
  fetchBuilderById,
  fetchBuilderBySerial,
  fetchMyBuilderProfile,
  deleteAdImage
} = require("../controller/builder");
const authMiddleware = require("../middleware/auth");
const { restrictTo } = require("../middleware/role");
const createUploader = require("../utils/multer");
const upload = createUploader("builder");

// Protected routes - /me first to avoid conflict with /:id
router.get("/me", authMiddleware, fetchMyBuilderProfile);
router.delete("/me/ad-image", authMiddleware, deleteAdImage);
router.get("/all", authMiddleware, restrictTo("admin"), fetchAllBuilders);

// Public route
router.get("/by-serial/:serial/:slug", fetchBuilderBySerial);
router.get("/:id", fetchBuilderById);

// Global middleware for remaining routes (updates)
router.use(authMiddleware);

// Builders can update their own profile, admins can update any builder
router.put("/update/:id", upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "logo", maxCount: 1 }, { name: "adImage", maxCount: 1 }]), updateBuilder);
router.put("/me/update", upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "logo", maxCount: 1 }, { name: "adImage", maxCount: 1 }]), updateBuilder);

module.exports = router;
