const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bedNumber: { type: Number, required: true },
    bedCapacity: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
});

const Bed = mongoose.model('Bed', bedSchema);

module.exports = Bed;
