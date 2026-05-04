const sebaService = require("../service/seba");

// --- SEBA USERS ---
exports.createSebaUser = async (req, res) => {
  try {
    const user = await sebaService.createSebaUser(req.body);
    return res.status(201).json({ status: "Success", data: user });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.loginSebaUser = async (req, res) => {
  try {
    const data = await sebaService.loginSebaUser(req.body);
    return res.status(200).json({ status: "Success", data });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.getAllSebaUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const result = await sebaService.getAllSebaUsers({ page, limit, search });
    return res.status(200).json({ status: "Success", ...result });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteSebaUser = async (req, res) => {
  try {
    await sebaService.deleteSebaUser(req.params.id);
    return res.status(200).json({ status: "Success" });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

// --- SEBA GLOBAL VIEWS ---
exports.incrementGlobalView = async (req, res) => {
  try {
    const viewCount = await sebaService.incrementGlobalView();
    return res.status(200).json({ status: "Success", data: { viewCount } });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getGlobalView = async (req, res) => {
  try {
    const viewCount = await sebaService.getGlobalView();
    return res.status(200).json({ status: "Success", data: { viewCount } });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

// --- SEBA ASSOCIATED ---
exports.createSebaAssociated = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) body.image = req.file.filename;
    const item = await sebaService.createSebaAssociated(body);
    return res.status(201).json({ status: "Success", data: item });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.getAllSebaAssociated = async (req, res) => {
  try {
    const data = await sebaService.getAllSebaAssociated();
    return res.status(200).json({ status: "Success", data });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteSebaAssociated = async (req, res) => {
  try {
    await sebaService.deleteSebaAssociated(req.params.id);
    return res.status(200).json({ status: "Success" });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

// --- SEBA MEMBERS ---
exports.createSebaMember = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.files) {
      if (req.files.image) body.image = req.files.image[0].filename;
      if (req.files.pdf) body.pdf = req.files.pdf[0].filename;
    } else if (req.file) {
       body.image = req.file.filename; // Fallback
    }
    // If public submission, set status to pending, else active (from admin)
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin && !body.status) body.status = 'pending';

    const item = await sebaService.createSebaMember(body);
    return res.status(201).json({ status: "Success", data: item });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.getAllSebaMembers = async (req, res) => {
  try {
    const { search, category, area, status } = req.query;
    // Check for token manually for public route
    let isAdmin = false;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "seba_secret");
        const USER = require("../model/user");
        const userVerify = await USER.findOne({ _id: decoded.id, isDeleted: false, status: "active" });
        if (userVerify && userVerify.role === 'admin') {
          isAdmin = true;
        }
      } catch (e) {
        // Ignore token errors for public routes
      }
    }
    const finalStatus = isAdmin ? status : 'active';
    const data = await sebaService.getAllSebaMembers({ search, category, area, status: finalStatus });
    return res.status(200).json({ status: "Success", data });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.updateSebaMemberStatus = async (req, res) => {
  try {
    const item = await sebaService.updateSebaMemberStatus(req.params.id, req.body.status);
    return res.status(200).json({ status: "Success", data: item });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.deleteSebaMember = async (req, res) => {
  try {
    await sebaService.deleteSebaMember(req.params.id);
    return res.status(200).json({ status: "Success" });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
