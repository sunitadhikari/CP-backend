const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  medicine: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
