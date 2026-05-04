const mongoose = require("mongoose");

const SebaMemberSchema = new mongoose.Schema(
  {
    memberId: { type: String, unique: true }, // Auto-generated like SEBA00059
    name: { type: String, required: true },
    position: { type: String },
    category: { type: String, required: true },
    area: { type: String }, // Used for Search
    mobile: { type: String, required: true },
    officeNo: { type: String },
    address: { type: String },
    emailWebsite: { type: String },
    company: { type: String }, // Displayed in the list
    image: { type: String }, // Passport photo
    pdf: { type: String }, // Attached form
    status: { type: String, default: "pending", enum: ["active", "pending", "inactive"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SebaMember", SebaMemberSchema);
