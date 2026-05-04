const Inquiry = require("../model/inquiry");

exports.addInquiry = async (req, res) => {
  try {
    const { userId, name, mobile, email, message } = req.body;

    if (!userId || !name || !mobile || !message) {
      return res.status(400).json({ status: "Fail", message: "Missing required fields" });
    }

    const Builder = require("../model/builder");
    const builderData = await Builder.findOne({ userId });

    const inquiry = await Inquiry.create({
      userId,
      builderId: builderData?._id,
      name,
      mobile,
      email,
      message,
    });

    return res.status(201).json({
      status: "Success",
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getInquiriesByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const inquiries = await Inquiry.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Inquiries fetched successfully",
      data: inquiries,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await Inquiry.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
