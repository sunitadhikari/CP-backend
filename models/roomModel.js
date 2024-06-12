const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    bedCapacity: { type: Number, required: true },
    charge: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
