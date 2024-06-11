const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  department: { type: String },
  picture: { type: String },
  dob: { type: String },
  sex: { type: String, required: true },
  bloodGroup: { type: String },
  designation: { type: String, required: true },
  address: { type: String, required: true },
  phoneNo: { type: String },
  mobileNo: { type: String, required: true },
  careerTitle: { type: String, required: true },
  biography: { type: String },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
