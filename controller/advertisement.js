const Advertisement = require("../model/advertisement");

exports.addAdvertisement = async (req, res) => {
  try {
    const { type, note } = req.body;
    const userId = req.user._id;

    // Fetch builderId to ensure we have the specific builder record
    const Builder = require("../model/builder");
    const builderData = await Builder.findOne({ userId });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: "Fail", message: "No images uploaded" });
    }

    const advertisements = await Promise.all(
      req.files.map((file) =>
        Advertisement.create({
          userId,
          builderId: builderData?._id,
          type: type || "Advertisement",
          image: file.filename,
          note: note || "",
        })
      )
    );

    return res.status(201).json({
      status: "Success",
      message: "Advertisement added successfully",
      data: advertisements,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getAdvertisementsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const advertisements = await Advertisement.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Advertisements fetched successfully",
      data: advertisements,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.updateAdvertisementType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!["Advertisement", "Running", "Upcoming"].includes(type)) {
      return res.status(400).json({ status: "Fail", message: "Invalid type" });
    }

    const updated = await Advertisement.findByIdAndUpdate(
      id,
      { type },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "Fail", message: "Advertisement not found" });
    }

    return res.status(200).json({
      status: "Success",
      message: "Advertisement type updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Advertisement.findByIdAndDelete(id);

    if (!deleted) {
        return res.status(404).json({ status: "Fail", message: "Advertisement not found" });
    }

    return res.status(200).json({
      status: "Success",
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
