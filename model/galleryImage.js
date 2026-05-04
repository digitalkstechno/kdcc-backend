const mongoose = require("mongoose");

const GalleryImageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    category: { type: String, enum: ["Impressive", "Awarded"], default: "Impressive", required: true },
    image: { type: String, required: true },
    title: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", GalleryImageSchema);
