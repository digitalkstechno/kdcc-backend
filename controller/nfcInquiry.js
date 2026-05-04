const NfcInquiry = require("../model/nfcInquiry");

exports.addNfcInquiry = async (req, res) => {
  try {
    const { userId, name, mobile, companyName } = req.body;

    if (!userId || !name || !mobile) {
      return res.status(400).json({ status: "Fail", message: "Missing required fields" });
    }

    const nfcInquiry = await NfcInquiry.create({
      userId,
      name,
      mobile,
      companyName,
    });

    return res.status(201).json({
      status: "Success",
      message: "NFC Inquiry submitted successfully",
      data: nfcInquiry,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getAllNfcInquiries = async (req, res) => {
  try {
    const inquiries = await NfcInquiry.find()
      .populate("userId", "companyName name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "NFC Inquiries fetched successfully",
      data: inquiries,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteNfcInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await NfcInquiry.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "NFC Inquiry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
