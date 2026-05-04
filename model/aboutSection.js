const mongoose = require("mongoose");

const AboutSectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    title: { type: String, required: true },
    content: { type: String, required: true }, // Rich text HTML
    image: { type: String }, // Optional image
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutSection", AboutSectionSchema);
