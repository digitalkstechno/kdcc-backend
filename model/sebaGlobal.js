const mongoose = require("mongoose");

const SebaGlobalSchema = new mongoose.Schema(
  {
    viewCount: { type: Number, default: 0 },
    identifier: { type: String, default: "global", unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SebaGlobal", SebaGlobalSchema);
