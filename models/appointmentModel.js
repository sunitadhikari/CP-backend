const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    username: { type: String,  },
    email: { type: String},
    departmentName:{type:String},
    doctorName:{type:String},
    date: {type: String, require:true},
    time:{type:String, require:true},
    phone: { type: Number, require: true },
    problem:{type: String, require:true},
    // specialist: {type: String, required: true},
    // status:{type:String, enum:['completed','cancelled', 'pending']},
})

const Appointments= mongoose.model('appointment', appointmentSchema);
module.exports= Appointments;