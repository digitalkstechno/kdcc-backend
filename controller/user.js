const {
  createUserService,
  loginUserService,
  fetchAllUsersService,
  fetchUserByIdService,
  userUpdateService,
  userDeleteService,
} = require("../service/user");
const ExcelJS = require('exceljs');
const BUILDER = require('../model/builder');
const USER = require('../model/user');
const { encryptData } = require('../utils/crypto');

exports.createUser = async (req, res) => {
  try {
    const userDetails = await createUserService(req.body);
    return res.status(201).json({ status: "Success", message: "User created successfully", data: userDetails });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { user, token } = await loginUserService(req.body);
    return res.status(200).json({ status: "Success", message: "User logged in successfully", data: user, token });
  } catch (error) {
    return res.status(400).json({ status: "Fail", message: error.message });
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    // Admin can fetch all roles (admin and user)
    const { totalUser, usersData } = await fetchAllUsersService({ page, limit, search });
    return res.status(200).json({
      status: "Success",
      message: "Users fetched successfully",
      pagination: { totalRecords: totalUser, currentPage: page, totalPages: Math.ceil(totalUser / limit), limit },
      data: usersData,
    });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.fetchUserById = async (req, res) => {
  try {
    const userData = await fetchUserByIdService(req.params.id);
    return res.status(200).json({ status: "Success", message: "User fetched successfully", data: userData });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ status: "Fail", message: "Unauthorized" });
    return res.status(200).json({ status: "Success", data: req.user });
  } catch (error) {
    return res.status(500).json({ status: "Fail", message: error.message });
  }
};

exports.userUpdate = async (req, res) => {
  try {
    const updatedUser = await userUpdateService(req.params.id, req.body);
    return res.status(200).json({ status: "Success", message: "User updated successfully", data: updatedUser });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.userDelete = async (req, res) => {
  try {
    await userDeleteService(req.params.id);
    return res.status(200).json({ status: "Success", message: "User deleted successfully" });
  } catch (error) {
    return res.status(404).json({ status: "Fail", message: error.message });
  }
};

exports.checkUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await fetchUserByIdService(id);
    return res.status(200).json({ 
      status: "Success", 
      data: { isActive: user.status === "active" && !user.isDeleted } 
    });
  } catch (error) {
    return res.status(200).json({ status: "Success", data: { isActive: false } });
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    // Fetch all users with builder details
    const { usersData } = await fetchAllUsersService({ page: 1, limit: 99999, search: '', roleFilter: 'user' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Employees');

    const HEADER_COLOR = '5B3F86';
    const headers = [
      { header: 'First Timestamp', key: 'createdAt', width: 18 },
      { header: 'Employee Name', key: 'name', width: 22 },
      { header: 'Designation', key: 'designation', width: 22 },
      { header: 'EDP Number', key: 'edpNumber', width: 16 },
      { header: 'Address', key: 'location', width: 30 },
      { header: 'Mobile Number', key: 'number', width: 16 },
      { header: 'Blood Group', key: 'bloodGroup', width: 14 },
      { header: 'Aadhar Number', key: 'aadharNumber', width: 18 },
      { header: 'Upload Image', key: 'uploadImage', width: 16 },
    ];

    sheet.columns = headers;

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + HEADER_COLOR } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });
    headerRow.height = 22;

    // Add data rows
    usersData.forEach((u) => {
      const row = sheet.addRow({
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '',
        name: u.name || '',
        designation: u.designation || '',
        edpNumber: u.edpNumber || '',
        location: u.location || '',
        number: u.number || '',
        bloodGroup: u.bloodGroup || '',
        aadharNumber: u.aadharNumber || '',
        uploadImage: '',
      });
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle' };
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=employees_${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ status: 'Fail', message: error.message });
  }
};

exports.bulkUploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'Fail', message: 'No file uploaded' });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];

    const results = { created: 0, skipped: 0, errors: [] };

    // Skip header row (row 1)
    for (let i = 2; i <= sheet.rowCount; i++) {
      const row = sheet.getRow(i);
      const name = row.getCell(2).value?.toString().trim();
      const designation = row.getCell(3).value?.toString().trim() || '';
      const edpNumber = row.getCell(4).value?.toString().trim() || '';
      const location = row.getCell(5).value?.toString().trim() || '';
      const number = row.getCell(6).value?.toString().trim() || '';
      const bloodGroup = row.getCell(7).value?.toString().trim() || '';
      const aadharNumber = row.getCell(8).value?.toString().trim() || '';

      if (!name || !number) { results.skipped++; continue; }
      if (!/^[0-9]{10}$/.test(number)) { results.errors.push(`Row ${i}: Invalid mobile number "${number}" - must be 10 digits`); continue; }
      if (aadharNumber && !/^[0-9]{12}$/.test(aadharNumber)) { results.errors.push(`Row ${i}: Invalid Aadhar number "${aadharNumber}" - must be 12 digits`); continue; }

      try {
        // Generate email: name (lowercase, no spaces) + last 3 digits of number + @gmail.com
        const namePart = name.toLowerCase().replace(/\s+/g, '');
        const numPart = number.slice(-3);
        const genEmail = `${namePart}${numPart}@gmail.com`;

        // Check if user already exists by number or generated email
        const existing = await USER.findOne({ $or: [{ number }, { email: genEmail }] });
        if (existing) { results.skipped++; continue; }

        const password = number.slice(-6) || '123456';
        const { createUserService } = require('../service/user');
        await createUserService({ name, number, email: genEmail, password, designation, edpNumber, location, bloodGroup, aadharNumber, role: 'user' });
        results.created++;
      } catch (e) {
        results.errors.push(`Row ${i}: ${e.message}`);
      }
    }

    return res.status(200).json({ status: 'Success', message: `Created: ${results.created}, Skipped: ${results.skipped}`, data: results });
  } catch (error) {
    return res.status(500).json({ status: 'Fail', message: error.message });
  }
};
