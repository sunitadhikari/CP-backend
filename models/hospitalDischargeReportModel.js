const mongoose = require('mongoose');

const hospitalDischargeReportSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    admissionDate: { type: Date, required: true },
    dischargeDate: { type: Date, required: true },
    finalDiagnosis: { type: String, required: true },
    summaryOfTreatment: { type: String, required: true },
    dischargeMedications: { type: String, required: true },
    followUpInstructions: { type: String, required: true },
    department: { type: String, required: true },
    ward: { type: String, required: true },
    bedNumber: { type: String, required: true },
    hospitalDischargeRequest: { type: Boolean, default: false }

});

const HospitalDischargeReport = mongoose.model('HospitalDischargeReport', hospitalDischargeReportSchema);
module.exports = HospitalDischargeReport;
