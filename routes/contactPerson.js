const express = require("express");
const router = express.Router();
const {
  addContactPerson,
  getContactPersonsByUserId,
  deleteContactPerson,
  updateContactPerson,
} = require("../controller/contactPerson");
const authMiddleware = require("../middleware/auth");
const createUploader = require("../utils/multer");
const upload = createUploader("builder");

// Protected route to add a contact person
router.post("/add", authMiddleware, upload.single("image"), addContactPerson);

// Public route to get contact persons for a builder
router.get("/user/:userId", getContactPersonsByUserId);

// Protected route to delete
router.delete("/delete/:id", authMiddleware, deleteContactPerson);

// Protected route to update
router.put("/update/:id", authMiddleware, upload.single("image"), updateContactPerson);

module.exports = router;
