const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: {
        type: String,
        unique: true
    },
    password: { type: String },
    confirmPassword: { type: String },
    termCondition: { type: Boolean },
    role: {
        type: String,
        enum: ["doctor", "patient", "admin"],
        default: "patient"
    }
})
const userHospital = mongoose.model('hospital', userSchema)
module.exports = userHospital;