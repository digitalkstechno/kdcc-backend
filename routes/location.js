const express = require("express");
const router = express.Router();
const {
  addLocation,
  getLocationsByUserId,
  deleteLocation,
  updateLocation,
} = require("../controller/location");
const authMiddleware = require("../middleware/auth");

// Protected route to add
router.post("/add", authMiddleware, addLocation);

// Public route to get
router.get("/user/:userId", getLocationsByUserId);

// Protected route to delete
router.delete("/delete/:id", authMiddleware, deleteLocation);

// Protected route to update
router.put("/update/:id", authMiddleware, updateLocation);

module.exports = router;
