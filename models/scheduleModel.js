const mongoose = require('mongoose')
const scheduleSchema = new mongoose.Schema({
    availableDaya:{type:String, require:true},
    startTime:{type:String, require:true},
    endTime:{type:String, require:true},
    mobileNumber:{type:Number, require:true},
    password:{type:String, require:true},
    bloodGroup:{type:String},
    sex:{type: String, require: true}, 
    dob:{type:String, require:true}
})
const schedule = mongoose.model('schedule', scheduleSchema);
module.exports = schedule;