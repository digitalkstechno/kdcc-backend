const dropboxService = require("../service/dropbox");

const dropboxController = {
  create: async (req, res) => {
    try {
      const images = req.files ? req.files.map(file => file.filename) : [];
      const data = await dropboxService.create({ ...req.body, images });
      res.status(201).json({ status: "Success", data });
    } catch (error) {
      res.status(400).json({ status: "Error", message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await dropboxService.getAll();
      res.status(200).json({ status: "Success", data });
    } catch (error) {
      res.status(400).json({ status: "Error", message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await dropboxService.delete(req.params.id);
      res.status(200).json({ status: "Success", message: "Deleted successfully" });
    } catch (error) {
      res.status(400).json({ status: "Error", message: error.message });
    }
  }
};

module.exports = dropboxController;
