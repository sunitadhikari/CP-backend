const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{type:String},
    email:{type:String,
        unique:true
    },
    password:{type:String},
    confirmPassword:{type:String},
    
})
const userHospital = mongoose.model('hospital', userSchema)
module.exports = userHospital;