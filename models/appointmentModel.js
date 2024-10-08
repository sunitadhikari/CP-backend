const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    username: { type: String,  },
    email: { type: String},
    departmentName: { type: String, required: true },
  doctorname: { type: String, required: true },
  date: { type: Date, required: true },
  //doctorEmail:{type:String},
  // time: { type: String, required: true },
  phone: { type: String, required: true },
  problem: { type: String, required: true },
  isPaid: { type: Boolean, default: false }

})

const Appointments= mongoose.model('appointment', appointmentSchema);
module.exports= Appointments;