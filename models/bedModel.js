// models/Bed.js

const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
    department: {
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
      }
  
});

module.exports = mongoose.model('Bed', BedSchema);
