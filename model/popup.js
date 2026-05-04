const mongoose = require("mongoose");

const PopupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    type: { type: String, enum: ["text", "image", "both"], default: "both" },
    content: { type: String }, // For text message
    image: { type: String },   // For image filename
    isActive: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Popup", PopupSchema);
