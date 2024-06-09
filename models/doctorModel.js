const mongoose = require('mongoose')
 const doctorSchema = new mongoose.Schema({
doctorName:{type:String},
specialist:{type:String},
day:{
    type:String, emum:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
},
time:{type: String},
username:{type:String},
email:{
    type:String,
    unique:true,
},
description:{type:String}, 
password:{type:String},
confirmPassword:{type:String}
})

const doctorRegister = mongoose.model('doctor', doctorSchema)
module.exports = doctorRegister;