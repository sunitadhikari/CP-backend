const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  amount: { type: String },
  dischargeDate: { type: Date, required: true },
  dischargeMedications: { type: String, required: true },
  followUpInstructions: { type: String, required: true },
  finalDiagnosis: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  summaryOfTreatment: { type: String, required: true },
  paymentType: { type: String, default: 'cash' }, // Default set to 'cash'
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);
