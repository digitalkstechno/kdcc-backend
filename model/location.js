const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    title: { type: String, required: true },
    address: { type: String, required: true },
    whatsappNumber: { type: String },
    email: { type: String },
    website: { type: String },
    googleMapLink: { type: String }, // For embedding or linking to Google Maps
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
