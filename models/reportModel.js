// models/report.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
