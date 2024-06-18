const mongoose = require('mongoose')
const scheduleSchema = new mongoose.Schema({
    doctorName:{type:String, require:true},
    availableDays:{type:String, require:true},
    startTime:{type:String, require:true},
    endTime:{type:String, require:true},
    mobileNumber:{type:Number, require:true},
    sex:{type: String, require: true} 
})
const schedule = mongoose.model('schedule', scheduleSchema);
module.exports = schedule;