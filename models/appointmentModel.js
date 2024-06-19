const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialist: {
        type: String, required: true, enum: ["Neurology",
            "Radiotherapy",
            "X-Rays",
            "Gynaecology",
            "Dermatology",
            "Ophthalmology",
            "Orthopedics",
            "Pediatrics",
            "Psychiatry", ,
            "Oncology",
            "Endocrinology",
            "Gastroenterology",
            "Nephrology",
            "Hematology",
            "Urology",
            "Otolaryngology",
            "Rheumatology",
            "Immunology",
            "Plastic Surgery",
            "General Surgery",
            "Infectious Disease",
            "Anesthesiology",
            "Pathology",
            " Emergency Medicine",
            " Family Medicine",
            " Sports Medicine",
            "  Allergy and Immunology",
            " Thoracic Surgery",
            " Vascular Surgery",
            " Pulmonology"]
    },
    phone: { type: Number, require: true },
    date: {type: String, require:true},
    problem:{type: String, require:true},
    time:{type:String, require:true}
})

const Appointments= mongoose.model('appointment', appointmentSchema);
module.exports= Appointments;