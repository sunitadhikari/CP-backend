const mongoose = require('mongoose');
const symptomsSchema = mongoose.Schema({
    patient:{type:String},
    doctor:{type:String},
    symptoms:{type:String}
})

const symptomsHospital = mongoose.model('symptoms', symptomsSchema)
module.exports= symptomsHospital