const mongoose = require('mongoose');

const doctorNoteSchema = new mongoose.Schema({
   patient:{ type:String },
   doctor:{type:String},
   date: { type:String },
   content:{ type:String }
})

const doctorNote = mongoose.model('doctorNote', doctorNoteSchema);
module.exports = doctorNote;   