const mongoose = require("mongoose");

const runMigrations = async () => {
  const BUILDER = require('../model/builder');
  const builders = await BUILDER.find({ serialNumber: { $exists: false } }).sort({ createdAt: 1 });
  if (builders.length > 0) {
    const lastBuilder = await BUILDER.findOne({ serialNumber: { $exists: true } }).sort({ serialNumber: -1 });
    let nextSerial = (lastBuilder?.serialNumber || 0) + 1;
    for (const b of builders) {
      b.serialNumber = nextSerial++;
      await b.save();
    }
    console.log(`✅ Assigned serialNumbers to ${builders.length} existing builders`);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected ✅`);
    await runMigrations();
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
