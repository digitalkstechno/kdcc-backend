const Appointment = require("../model/appointment");

exports.addAppointment = async (req, res) => {
  try {
    const { userId, name, mobile, date, time, message } = req.body;

    if (!userId || !name || !mobile || !date || !time) {
      return res.status(400).json({ status: "Fail", message: "Missing required fields" });
    }

    const Builder = require("../model/builder");
    const builderData = await Builder.findOne({ userId });

    const appointment = await Appointment.create({
      userId,
      builderId: builderData?._id,
      name,
      mobile,
      date,
      time,
      message,
    });

    return res.status(201).json({
      status: "Success",
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ userId }).sort({ date: 1, time: 1 });

    return res.status(200).json({
      status: "Success",
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({
      status: "Success",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};
