const mongoose = require('mongoose')
const labSchema = new mongoose.Schema({
    firstName:{type:String, required: true},
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNo: { type: Number },
    mobileNo: { type: Number, required: true },
    bloodGroup: { type: String },
    dob: { type: String },
    sex: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const lab = mongoose.model('lab', labSchema);
module.exports = lab;