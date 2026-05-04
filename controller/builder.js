const resolveIP = (ip) => {
  if (!ip || ip === "::1" || ip === "127.0.0.1") return "localhost";
  if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
  return ip;
};

const BUILDER = require("../model/builder");
const {
  fetchAllUsersService,
  userUpdateService,
  fetchUserByIdService,
} = require("../service/user");

exports.fetchAllBuilders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    // Hardcode filter for ONLY 'user' role
    const { totalUser, usersData } = await fetchAllUsersService({ page, limit, search, roleFilter: "user" });
    
    return res.status(200).json({
      status: "Success",
      message: "Builders fetched successfully",
      pagination: { totalRecords: totalUser, currentPage: page, totalPages: Math.ceil(totalUser / limit), limit },
      data: usersData,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.updateBuilder = async (req, res) => {
  try {
    // Only allow updating if it's the builder themselves or an admin
    const userIdToUpdate = req.params.id || req.user._id;
    
    // If files were uploaded, add their filenames to the body
    if (req.file) {
      req.body.profileImage = req.file.filename;
    }
    if (req.files) {
      if (req.files.profileImage) req.body.profileImage = req.files.profileImage[0].filename;
      if (req.files.logo) req.body.logo = req.files.logo[0].filename;
      if (req.files.adImage) req.body.adImage = req.files.adImage[0].filename;
    }


    const updatedBuilder = await userUpdateService(userIdToUpdate, req.body);
    return res.status(200).json({ status: "Success", message: "Builder updated successfully", data: updatedBuilder });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.fetchBuilderById = async (req, res) => {
  try {
    const builderData = await fetchUserByIdService(req.params.id);
    if (builderData.role !== "user") {
        throw new Error("User found but is not a builder");
    }

    // Unique view logic
    const rawIP = 
      req.headers['cf-connecting-ip'] || 
      req.headers['x-client-ip'] || 
      req.headers['x-real-ip'] || 
      req.headers['x-forwarded-for']?.split(',')[0] || 
      req.socket.remoteAddress;
      
    const clientIP = resolveIP(rawIP);
    
    // Find the builder record to update unique views
    const builderRecord = await BUILDER.findOne({ userId: builderData._id }).select("+uniqueIPs");
    if (builderRecord) {
      if (!builderRecord.uniqueIPs.includes(clientIP)) {
        builderRecord.uniqueIPs.push(clientIP);
        builderRecord.viewCount = (builderRecord.viewCount || 0) + 1;
        await builderRecord.save();
      }
      builderData.viewCount = builderRecord.viewCount;
    }

    return res.status(200).json({ status: "Success", message: "Builder fetched successfully", data: builderData });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.fetchBuilderBySerial = async (req, res) => {
  try {
    const { serial, slug } = req.params;
    // Find by permanent serialNumber - never changes
    const details = await BUILDER.findOne({ serialNumber: parseInt(serial) });
    if (!details) return res.status(404).json({ status: "Fail", message: "Builder not found" });

    const { fetchUserByIdService } = require('../service/user');
    const builderData = await fetchUserByIdService(details.userId.toString());
    if (builderData.role !== "user") throw new Error("Not a builder");

    // Unique view logic
    const rawIP =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-client-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.socket.remoteAddress;
    const clientIP = resolveIP(rawIP);

    const builderRecord = await BUILDER.findOne({ userId: builderData._id }).select("+uniqueIPs");
    if (builderRecord) {
      if (!builderRecord.uniqueIPs.includes(clientIP)) {
        builderRecord.uniqueIPs.push(clientIP);
        builderRecord.viewCount = (builderRecord.viewCount || 0) + 1;
        await builderRecord.save();
      }
      builderData.viewCount = builderRecord.viewCount;
    }

    return res.status(200).json({ status: "Success", message: "Builder fetched successfully", data: builderData });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.fetchMyBuilderProfile = async (req, res) => {
  try {
    // req.user is already populated by authMiddleware with both User and Builder details
    return res.status(200).json({ status: "Success", message: "Profile fetched successfully", data: req.user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteAdImage = async (req, res) => {
  try {
    const userIdToUpdate = req.user._id;
    const builderRecord = await BUILDER.findOne({ userId: userIdToUpdate });
    if (!builderRecord) {
      return res.status(404).json({ status: "Fail", message: "Builder not found" });
    }
    if (builderRecord.adImage) {
      const { deleteUploadedFile } = require("../utils/fileHelper");
      deleteUploadedFile("builder", builderRecord.adImage);
      builderRecord.adImage = "";
      await builderRecord.save();
    }
    return res.status(200).json({ status: "Success", message: "Advertisement image removed successfully", data: builderRecord });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
