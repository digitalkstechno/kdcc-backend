const express = require("express");
const router = express.Router();
const { addInquiry, getInquiriesByUserId, deleteInquiry } = require("../controller/inquiry");
const authMiddleware = require("../middleware/auth");

router.post("/add", addInquiry); // Public route
router.get("/user", authMiddleware, getInquiriesByUserId); // Private route
router.delete("/delete/:id", authMiddleware, deleteInquiry);

module.exports = router;
