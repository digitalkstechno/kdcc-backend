const ContactPerson = require("../model/contactPerson");
const { deleteUploadedFile } = require("../utils/fileHelper");

exports.addContactPerson = async (req, res) => {
  try {
    const { name, designation, role } = req.body;
    const userId = req.user._id;

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const contactPerson = await ContactPerson.create({
      userId,
      builderId: req.user.builderId,
      name,
      designation,
      role,
      image,
    });

    return res.status(201).json({
      status: "Success",
      message: "Contact person added successfully",
      data: contactPerson,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getContactPersonsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const contactPersons = await ContactPerson.find({ userId });

    return res.status(200).json({
      status: "Success",
      message: "Contact persons fetched successfully",
      data: contactPersons,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteContactPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const contactPerson = await ContactPerson.findById(id);

    if (!contactPerson) {
      throw new Error("Contact person not found");
    }

    // Delete image if exists
    if (contactPerson.image) {
      deleteUploadedFile("builder", contactPerson.image);
    }

    await ContactPerson.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Contact person deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.updateContactPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, role } = req.body;
    
    const contactPerson = await ContactPerson.findById(id);
    if (!contactPerson) {
      throw new Error("Contact person not found");
    }

    if (req.file) {
      // Delete old image if exists
      if (contactPerson.image) {
        deleteUploadedFile("builder", contactPerson.image);
      }
      req.body.image = req.file.filename;
    }

    const updated = await ContactPerson.findByIdAndUpdate(
      id,
      { name, designation, role, ...(req.body.image && { image: req.body.image }) },
      { new: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Contact person updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
