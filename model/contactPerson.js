const mongoose = require("mongoose");

const ContactPersonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    name: { type: String, required: true },
    designation: { type: String },
    role: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactPerson", ContactPersonSchema);
