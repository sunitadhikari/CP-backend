const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema({
    name:{type: String},
    age:{type: String},
    gender:{type:String},
    diagnosis:{type:String},
    
})