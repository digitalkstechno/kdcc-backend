const mongoose = require("mongoose");

const BuilderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serialNumber: { type: Number, unique: true },
    name: { type: String },
    number: { type: String },
    location: { type: String },
    homeAddress: { type: String },
    timing: { type: String },
    profileImage: { type: String },
    website: { type: String },
    refer: { type: String },
    secondaryNumber: { type: String },
    whatsappNumber: { type: String },
    facebookLink: { type: String },
    instagramLink: { type: String },
    youtubeLink: { type: String },
    linkedinLink: { type: String },
    twitterLink: { type: String },
    messageNumber: { type: String },
    logo: { type: String },
    companyName: { type: String },
    designation: { type: String },
    bloodGroup: { type: String },
    aadharNumber: { type: String },
    edpNumber: { type: String },
    adImage: { type: String },
    viewCount: { type: Number, default: 0 },

    uniqueIPs: { type: [String], select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Builder", BuilderSchema);
