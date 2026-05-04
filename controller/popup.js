const Popup = require("../model/popup");
const Builder = require("../model/builder");

exports.upsertPopup = async (req, res) => {
  try {
    const { type, content, isActive } = req.body;
    const userId = req.user._id;
    const builderData = await Builder.findOne({ userId });

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    // Since only one popup can be active at a time for a builder,
    // if this one is being set to active, deactivate all others.
    if (isActive === "true" || isActive === true) {
      await Popup.updateMany({ userId }, { isActive: false });
    }

    // Check if we already have a popup (to update) or creating new
    // For simplicity, we can just allow multiple popups but only one isActive.
    // Or we can just have ONE popup document and keep updating it.
    // Let's allow multiple so they can save different ones and switch.
    
    const popup = await Popup.create({
      userId,
      builderId: builderData?._id,
      type,
      content,
      image,
      isActive: isActive === "true" || isActive === true
    });

    return res.status(201).json({
      status: "Success",
      message: "Popup created successfully",
      data: popup,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getPopupsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const popups = await Popup.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Popups fetched successfully",
      data: popups,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getActivePopup = async (req, res) => {
  try {
    const userId = req.params.userId;
    const popup = await Popup.findOne({ userId, isActive: true });

    return res.status(200).json({
      status: "Success",
      message: "Active popup fetched successfully",
      data: popup,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.togglePopupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const userId = req.user._id;

    if (isActive) {
      // Deactivate all others first
      await Popup.updateMany({ userId }, { isActive: false });
    }

    const updated = await Popup.findByIdAndUpdate(id, { isActive }, { new: true });

    return res.status(200).json({
      status: "Success",
      message: "Popup status updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deletePopup = async (req, res) => {
  try {
    const { id } = req.params;
    await Popup.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Popup deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
