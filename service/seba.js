const SebaUser = require("../model/sebaUser");
const SebaAssociated = require("../model/sebaAssociated");
const SebaMember = require("../model/sebaMember");
const SebaGlobal = require("../model/sebaGlobal");
const jwt = require("jsonwebtoken");
const { deleteUploadedFile } = require("../utils/fileHelper");

// --- SEBA USERS ---
exports.createSebaUser = async (body) => {
  const { name, mobile } = body;
  const existingUser = await SebaUser.findOne({ mobile });
  if (existingUser) throw new Error("Mobile number already registered");
  const user = await SebaUser.create({ name, mobile });
  return user;
};

exports.loginSebaUser = async ({ name, mobile }) => {
  const user = await SebaMember.findOne({ mobile, status: "active" });
  if (!user) throw new Error("Member not found or inactive");
  // Simple check
  if (user.name.toLowerCase() !== name.toLowerCase()) throw new Error("Invalid name or mobile");
  const token = jwt.sign({ id: user._id, role: 'seba_user' }, process.env.JWT_SECRET_KEY || "seba_secret");
  return { user, token };
};

exports.getAllSebaUsers = async ({ page = 1, limit = 10, search = "" }) => {
  const skip = (page - 1) * limit;
  const matchQuery = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } }
    ]
  };
  const total = await SebaUser.countDocuments(matchQuery);
  const data = await SebaUser.find(matchQuery).skip(skip).limit(limit).sort({ createdAt: -1 });
  return { total, data, page, limit };
};

exports.deleteSebaUser = async (id) => {
  await SebaUser.findByIdAndDelete(id);
};

// --- SEBA GLOBAL VIEWS ---
exports.incrementGlobalView = async () => {
  let global = await SebaGlobal.findOne({ identifier: "global" });
  if (!global) {
    global = await SebaGlobal.create({ identifier: "global", viewCount: 0 });
  }
  global.viewCount += 1;
  await global.save();
  return global.viewCount;
};

exports.getGlobalView = async () => {
  const global = await SebaGlobal.findOne({ identifier: "global" });
  return global ? global.viewCount : 0;
};

// --- SEBA ASSOCIATED ---
exports.createSebaAssociated = async (body) => {
  return await SebaAssociated.create(body);
};

exports.getAllSebaAssociated = async () => {
  return await SebaAssociated.find({ status: "active" }).sort({ createdAt: -1 });
};

exports.deleteSebaAssociated = async (id) => {
  const item = await SebaAssociated.findById(id);
  if (item && item.image) {
    deleteUploadedFile("builder", item.image); // Assuming we store in builder or seba folder
  }
  await SebaAssociated.findByIdAndDelete(id);
};

// --- SEBA MEMBERS ---
exports.createSebaMember = async (body) => {
  // Generate a memberId
  const lastMember = await SebaMember.findOne().sort({ memberId: -1 });
  let nextNum = 1;
  if (lastMember && lastMember.memberId) {
    const currentNum = parseInt(lastMember.memberId.replace("SEBA", ""));
    if (!isNaN(currentNum)) {
      nextNum = currentNum + 1;
    }
  }
  const memberId = `SEBA${String(nextNum).padStart(5, '0')}`;
  return await SebaMember.create({ ...body, memberId });
};

exports.getAllSebaMembers = async ({ search = "", category = "", area = "", status = "" }) => {
  const matchQuery = {};
  if (search) {
    matchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { memberId: { $regex: search, $options: "i" } }
    ];
  }
  if (category) matchQuery.category = { $regex: new RegExp(`^${category}$`, "i") };
  if (area) matchQuery.area = { $regex: new RegExp(`^${area}$`, "i") };
  if (status) matchQuery.status = status;

  return await SebaMember.find(matchQuery).sort({ createdAt: -1 });
};

exports.updateSebaMemberStatus = async (id, status) => {
  return await SebaMember.findByIdAndUpdate(id, { status }, { new: true });
};

exports.deleteSebaMember = async (id) => {
  const item = await SebaMember.findById(id);
  if (item) {
    if (item.image) deleteUploadedFile("builder", item.image);
    if (item.pdf) deleteUploadedFile("builder", item.pdf);
    await SebaMember.findByIdAndDelete(id);
  }
};
