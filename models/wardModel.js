const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
//   wardName: { type: String, required: true },
wardType: { type: String, enum: ['General', 'ICU', 'Emergency', 'Maternity', 'Pediatrics', 'Surgical', 'Orthopedic', 'Cardiology', 'Oncology', 'Psychiatric'], required: true },
capacity: { type: Number, required: true },
});

module.exports = mongoose.model('Ward', WardSchema);
