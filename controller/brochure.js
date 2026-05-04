const Brochure = require("../model/brochure");

exports.addBrochure = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ status: "Fail", message: "No PDF file uploaded" });
    }

    const fileSize = (req.file.size / (1024 * 1024)).toFixed(1) + " MB";

    const brochure = await Brochure.create({
      userId,
      builderId: req.user.builderId,
      title: title || req.file.originalname,
      file: req.file.filename,
      fileSize,
    });

    return res.status(201).json({
      status: "Success",
      message: "Brochure uploaded successfully",
      data: brochure,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getBrochuresByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const brochures = await Brochure.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Brochures fetched successfully",
      data: brochures,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteBrochure = async (req, res) => {
  try {
    const { id } = req.params;
    await Brochure.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Brochure deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
