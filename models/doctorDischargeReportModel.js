const mongoose = require('mongoose');

const doctorDischargeReportSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    medicalHistory: { type: String, required: true },
    department: { type: String, required: true },
    ward: { type: String, required: true },
    bedNumber: { type: String, required: true },
    admittedAt: { type: Date, required: true },
    dischargeDate: { type: Date, required: true },
    diagnosis: { type: String, required: true },
    treatmentGiven: { type: String, required: true },
    dischargeInstructions: { type: String, required: true },
    followUpPlan: { type: String, required: true }, 
    dischargeRequest: { type: Boolean, default: false }


});

const DoctorDischargeReport = mongoose.model('DoctorDischargeReport', doctorDischargeReportSchema);
module.exports = DoctorDischargeReport;
