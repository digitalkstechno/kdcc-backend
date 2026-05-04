const mongoose = require("mongoose");

const NfcInquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder", required: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    companyName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NfcInquiry", NfcInquirySchema);
