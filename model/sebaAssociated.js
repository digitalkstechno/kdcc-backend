const mongoose = require("mongoose");

const SebaAssociatedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SebaAssociated", SebaAssociatedSchema);
