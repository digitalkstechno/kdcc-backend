const mongoose = require("mongoose");

const GalleryVideoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    category: { type: String, enum: ["General", "Awarded"], default: "General", required: true },
    video: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryVideo", GalleryVideoSchema);
