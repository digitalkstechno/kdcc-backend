const mongoose = require("mongoose");

const SebaUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SebaUser", SebaUserSchema);
