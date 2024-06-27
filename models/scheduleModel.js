const mongoose = require('mongoose')
const scheduleSchema = new mongoose.Schema({
    doctorName:{type:String},
    availableDays:{type:String},
    startTime:{type:String},
    endTime:{type:String},
    mobileNumber:{type:Number},
    sex:{type: String} 
})
const schedule = mongoose.model('schedule', scheduleSchema);
module.exports = schedule;