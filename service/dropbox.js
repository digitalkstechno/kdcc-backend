const Dropbox = require("../model/dropbox");

const dropboxService = {
  create: async (data) => {
    return await Dropbox.create(data);
  },

  getAll: async () => {
    return await Dropbox.find().populate("builderId", "companyName location");
  },

  getByBuilder: async (builderId) => {
    return await Dropbox.find({ builderId }).sort({ createdAt: -1 });
  },

  delete: async (id) => {
    return await Dropbox.findByIdAndDelete(id);
  }
};

module.exports = dropboxService;
