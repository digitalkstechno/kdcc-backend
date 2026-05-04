const AboutSection = require("../model/aboutSection");
const { deleteUploadedFile } = require("../utils/fileHelper");

exports.addAboutSection = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const section = await AboutSection.create({
      userId,
      builderId: req.user.builderId,
      title,
      content,
      image,
    });

    return res.status(201).json({
      status: "Success",
      message: "About section added successfully",
      data: section,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getAboutSectionsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sections = await AboutSection.find({ userId });

    return res.status(200).json({
      status: "Success",
      message: "About sections fetched successfully",
      data: sections,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteAboutSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await AboutSection.findById(id);

    if (!section) {
      throw new Error("Section not found");
    }

    if (section.image) {
      deleteUploadedFile("builder", section.image);
    }

    await AboutSection.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "About section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.updateAboutSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const section = await AboutSection.findById(id);
    if (!section) {
      throw new Error("Section not found");
    }

    let updateData = { title, content };

    if (req.file) {
      if (section.image) {
        deleteUploadedFile("builder", section.image);
      }
      updateData.image = req.file.filename;
    } else if (req.body.removeImage === "true") {
      if (section.image) {
        deleteUploadedFile("builder", section.image);
      }
      updateData.image = "";
    }

    const updated = await AboutSection.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "About section updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
