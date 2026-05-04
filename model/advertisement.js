const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder" },
    type: { 
      type: String, 
      enum: ["Advertisement", "Running", "Upcoming"], 
      default: "Advertisement", 
      required: true 
    },
    image: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisement", AdvertisementSchema);
