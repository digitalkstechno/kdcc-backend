const express = require("express");
const router = express.Router();
const { addAppointment, getAppointmentsByUserId, deleteAppointment } = require("../controller/appointment");
const authMiddleware = require("../middleware/auth");

router.post("/add", addAppointment); // Public route
router.get("/user", authMiddleware, getAppointmentsByUserId); // Private route
router.delete("/delete/:id", authMiddleware, deleteAppointment);

module.exports = router;
