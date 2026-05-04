const Location = require("../model/location");

exports.addLocation = async (req, res) => {
  try {
    const { title, address, whatsappNumber, email, website, googleMapLink } = req.body;
    const userId = req.user._id;

    const location = await Location.create({
      userId,
      builderId: req.user.builderId,
      title,
      address,
      whatsappNumber,
      email,
      website,
      googleMapLink,
    });

    return res.status(201).json({
      status: "Success",
      message: "Location added successfully",
      data: location,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getLocationsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const locations = await Location.find({ userId });

    return res.status(200).json({
      status: "Success",
      message: "Locations fetched successfully",
      data: locations,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Location deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, address, whatsappNumber, email, website, googleMapLink } = req.body;

    const updated = await Location.findByIdAndUpdate(
      id,
      { title, address, whatsappNumber, email, website, googleMapLink },
      { new: true }
    );

    if (!updated) {
      throw new Error("Location not found");
    }

    return res.status(200).json({
      status: "Success",
      message: "Location updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
