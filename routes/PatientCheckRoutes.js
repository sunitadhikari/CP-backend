const express = require('express');
const router = express.Router();
const verifyToken=require('../middleware');
const Patient = require('../models/PatientCheckModel');

router.post('/postcheck',verifyToken,async(req,res)=>{
    const { email }=req.user;
    const user = await Signup.findOne({email});
    if(!user){
        return res.status(404).send("User not found!");
    }
    const { firstName,
    lastName,
    dob,
    gender,
    contactNumber,
    address,
    medicalHistory,
    department,
    bedNumber,
    admittedAt,
    dischargeDate}=req.body;

    const patient = new Patient({
        firstName,
        lastName,
        gender,
        contactNumber,
        address,
        medicalHistory,
        department,
        bedNumber,
        admittedAt,
        dischargeDate,
        dob,
        checkedBy:email
    });
    
})
