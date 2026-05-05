const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  fetchAllUsers,
  fetchUserById,
  getCurrentUser,
  userUpdate,
  userDelete,
  checkUserStatus,
  downloadExcel,
  bulkUploadExcel,
} = require("../controller/user");
const authMiddleware = require("../middleware/auth");
const { restrictTo } = require("../middleware/role");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", loginUser);
router.get("/status/:id", checkUserStatus);

// Apply authMiddleware to all routes below
router.use(authMiddleware);

router.post("/create", restrictTo("admin"), createUser);
router.get("/all", restrictTo("admin"), fetchAllUsers);
router.get("/me", getCurrentUser);
router.get("/download-excel", restrictTo("admin"), downloadExcel);
router.post("/bulk-upload", restrictTo("admin"), upload.single('file'), bulkUploadExcel);
router.get("/:id", restrictTo("admin"), fetchUserById);
router.put("/update/:id", restrictTo("admin"), userUpdate);
router.delete("/delete/:id", restrictTo("admin"), userDelete);

module.exports = router;
