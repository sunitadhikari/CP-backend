const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phoneNo: { type: String },
    mobileNo:{type:String},
    department:{type:String},
    picture: {type:String},
    sex:{type:String},
    bloodGroup:{type:String},
    address: {type:String},
    specialist: {type:String},
    careerTitle:{type:String},
    biography: {type:String},
    status:{type:String},
    email: {
        type: String,
        unique: true
    },
    password: { type: String },
    confirmPassword: { type: String },
    termCondition: { type: Boolean },
    role: {
        type: String,
        enum: ["doctor", "patient", "admin", "labtec"],
        default: "patient"
    }
})
const userHospital = mongoose.model('hospital', userSchema)
module.exports = userHospital;