var express = require("express");
var router = express.Router();

router.use("/health", require("./health"));
router.use("/user", require("./user"));
router.use("/builder", require("./builder"));
router.use("/contact-person", require("./contactPerson"));
router.use("/about-section", require("./aboutSection"));
router.use("/location", require("./location"));
router.use("/gallery-image", require("./galleryImage"));
router.use("/gallery-video", require("./galleryVideo"));
router.use("/advertisement", require("./advertisement"));
router.use("/brochure", require("./brochure"));
router.use("/inquiry", require("./inquiry"));
router.use("/appointment", require("./appointment"));
router.use("/popup", require("./popup"));
router.use("/dropbox", require("./dropbox"));
router.use("/seba", require("./seba"));
router.use("/nfc", require("./nfcInquiry"));

module.exports = router;
