const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactNumber: { type: String, required: true },
  address: { type: String },
  medicalHistory: { type: String },
  department: { type: String },
  bedNumber: { type: String },
  admittedAt: { type: Date, default: Date.now },
    dischargeDate: { type: Date },
  checkedBy:{type: String, required:true}
});

const Patient = mongoose.model('patientCheck', patientSchema);

module.exports = Patient;