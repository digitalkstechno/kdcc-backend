const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
