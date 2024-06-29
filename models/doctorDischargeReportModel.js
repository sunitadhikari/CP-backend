const mongoose = require('mongoose');

const doctorDischargeReportSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    diagnosis: { type: String, required: true },
    treatmentGiven: { type: String, required: true },
    dischargeInstructions: { type: String, required: true },
    followUpPlan: { type: String, required: true }
});

const DoctorDischargeReport = mongoose.model('DoctorDischargeReport', doctorDischargeReportSchema);
module.exports = DoctorDischargeReport;
