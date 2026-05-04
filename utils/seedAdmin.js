require("dotenv").config();
const mongoose = require("mongoose");
const USER = require("../model/user");
const BUILDER = require("../model/builder");
const { encryptData } = require("./crypto");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@gmail.com";
    const existingUser = await USER.findOne({ email: adminEmail });
    if (existingUser) {
        await BUILDER.deleteMany({ userId: existingUser._id });
        await USER.deleteOne({ _id: existingUser._id });
    }

    const adminData = {
      email: adminEmail,
      number: "1234567890",
      password: encryptData("123456"),
      role: "admin",
      status: "active",
      isDeleted: false
    };

    const user = await USER.create(adminData);

    console.log("Admin created successfully! 🚀");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
