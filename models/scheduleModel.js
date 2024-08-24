const mongoose = require('mongoose')
const scheduleSchema = new mongoose.Schema({
    doctorName:{type:String},
    // availableDays:{type:String},
    date: { type: String , required: true }, 
    startTime:{type:String},
    endTime:{type:String},
    mobileNumber:{type:Number},
    sex:{type: String} 
})
const schedule = mongoose.model('schedule', scheduleSchema);
module.exports = schedule;