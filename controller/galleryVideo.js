const GalleryVideo = require("../model/galleryVideo");

exports.addVideos = async (req, res) => {
  try {
    const { category } = req.body;
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: "Fail", message: "No videos uploaded" });
    }

    const videos = await Promise.all(
      req.files.map((file) =>
        GalleryVideo.create({
          userId,
          builderId: req.user.builderId,
          category: category || "General",
          video: file.filename,
        })
      )
    );

    return res.status(201).json({
      status: "Success",
      message: "Videos uploaded successfully",
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getVideosByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const videos = await GalleryVideo.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "Videos fetched successfully",
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await GalleryVideo.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Video deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
