// models/Bed.js

const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  ward: {
        type: String,
        required: true
      },
      bedNumbers: {
        type: Number,
        required: true
      },
      charges: {
        type: Number,
        default: 0 
      },
      occupied: {
        type: Boolean,
        default: false
    }
  
});

module.exports = mongoose.model('Bed', BedSchema);
