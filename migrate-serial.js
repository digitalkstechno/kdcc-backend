// Run once: node migrate-serial.js
require('dotenv').config();
const mongoose = require('mongoose');
const BUILDER = require('./model/builder');

async function migrate() {
  const uri = process.env.MONGO_URI?.trim();
  await mongoose.connect(uri);
  console.log('Connected');

  const builders = await BUILDER.find({ serialNumber: { $exists: false } }).sort({ createdAt: 1 });
  console.log(`Found ${builders.length} builders without serialNumber`);

  for (let i = 0; i < builders.length; i++) {
    builders[i].serialNumber = i + 1;
    await builders[i].save();
    console.log(`Assigned serial ${i + 1} to ${builders[i].name}`);
  }

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
