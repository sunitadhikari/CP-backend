const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phoneNo: { type: String },
    mobileNo:{type:String},
    dob:{type:String},
    department:{type:String},
    image: {type:String},
    sex:{type:String},
    bloodGroup:{type:String},
    address: {type:String},
    specialist: {type:String},
    careerTitle:{type:String},
    biography: {type:String},
    status:{type:String},
    image:{type:String},
    email: {
        type: String,
        unique: true
    },
    password: { type: String },
    confirmPassword: { type: String },
    termCondition: { type: Boolean },
    role: {
        type: String,
        enum: ["doctor", "patient", "admin", "labtec", "reception"],
        default: "patient"
    },
    isVerified:{type:Boolean, require:true},
    registeredDate:{type:String}
})
const userHospital = mongoose.model('hospital', userSchema)
module.exports = userHospital;