const mongoose = require("mongoose");

const DropboxSchema = new mongoose.Schema(
  {
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: "Builder", required: true },
    cardType: { type: String },
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String },
    companyName: { type: String },
    message: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dropbox", DropboxSchema);
