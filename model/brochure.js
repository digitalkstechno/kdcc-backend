const mongoose = require("mongoose");

const BrochureSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    title: { type: String, required: true },
    file: { type: String, required: true },
    fileSize: { type: String }, // e.g. "18 MB"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brochure", BrochureSchema);
