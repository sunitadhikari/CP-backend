const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phoneNo: { type: String },
    mobileNo: { type: String, required: true },
    bloodGroup: { type: String },
    sex: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
