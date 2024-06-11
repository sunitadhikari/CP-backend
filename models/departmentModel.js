const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  mainDepartment: { type: String, required: true },
  flaticon: { type: String },
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], required: true }
});

module.exports = mongoose.model('Department', DepartmentSchema);
