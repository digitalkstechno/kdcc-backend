const mongoose = require("mongoose");

const BuilderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    number: { type: String },
    location: { type: String },
    timing: { type: String },
    profileImage: { type: String },
    website: { type: String },
    refer: { type: String },
    secondaryNumber: { type: String },
    whatsappNumber: { type: String },
    facebookLink: { type: String },
    instagramLink: { type: String },
    messageNumber: { type: String },
    logo: { type: String },
    companyName: { type: String },
    adImage: { type: String },
    viewCount: { type: Number, default: 0 },

    uniqueIPs: { type: [String], select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Builder", BuilderSchema);
