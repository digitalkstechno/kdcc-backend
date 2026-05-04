const express = require("express");
const router = express.Router();
const sebaController = require("../controller/seba");
const createUploader = require("../utils/multer");
const upload = createUploader("builder");
const authMiddleware = require("../middleware/auth");
const { restrictTo } = require("../middleware/role");

// Public routes
router.post("/user/login", sebaController.loginSebaUser);
router.post("/view", sebaController.incrementGlobalView);
router.get("/view", sebaController.getGlobalView);
router.get("/associated", sebaController.getAllSebaAssociated);
router.get("/member", sebaController.getAllSebaMembers);
router.post("/member/new", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), sebaController.createSebaMember);

// Admin routes (require auth)
router.use(authMiddleware);

router.post("/user", restrictTo("admin"), sebaController.createSebaUser);
router.get("/user", restrictTo("admin"), sebaController.getAllSebaUsers);
router.delete("/user/:id", restrictTo("admin"), sebaController.deleteSebaUser);

router.post("/associated", restrictTo("admin"), upload.single("image"), sebaController.createSebaAssociated);
router.delete("/associated/:id", restrictTo("admin"), sebaController.deleteSebaAssociated);

router.post("/member", restrictTo("admin"), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), sebaController.createSebaMember);
router.put("/member/:id/status", restrictTo("admin"), sebaController.updateSebaMemberStatus);
router.delete("/member/:id", restrictTo("admin"), sebaController.deleteSebaMember);

module.exports = router;
