const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    number: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
