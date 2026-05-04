const GalleryImage = require("../model/galleryImage");
const path = require("path");

exports.addImages = async (req, res) => {
  try {
    const { category, title } = req.body;
    const userId = req.user._id;

    const Builder = require("../model/builder");
    const builderData = await Builder.findOne({ userId });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: "Fail", message: "No images uploaded" });
    }

    const images = await Promise.all(
      req.files.map((file) =>
        GalleryImage.create({
          userId,
          builderId: builderData?._id,
          category: category || "Impressive",
          image: file.filename,
          title: title || "",
        })
      )
    );

    return res.status(201).json({
      status: "Success",
      message: "Images uploaded successfully",
      data: images,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getImagesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const images = await GalleryImage.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Images fetched successfully",
      data: images,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await GalleryImage.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
