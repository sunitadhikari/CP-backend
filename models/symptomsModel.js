const mongoose = require('mongoose');
const symptomsSchema = mongoose.Schema({
    doctor:{type:String},
    symptoms:{type:String},
    issue:{type:String}
})

const symptomsHospital = mongoose.model('symptoms', symptomsSchema)
module.exports= symptomsHospital