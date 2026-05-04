const express = require("express");
const router = express.Router();
const { addNfcInquiry, getAllNfcInquiries, deleteNfcInquiry } = require("../controller/nfcInquiry");
const authMiddleware = require("../middleware/auth");

router.post("/add", addNfcInquiry); // Public route
router.get("/all", authMiddleware, getAllNfcInquiries); // Admin route
router.delete("/delete/:id", authMiddleware, deleteNfcInquiry);

module.exports = router;
