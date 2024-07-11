const express = require('express');
const router = express.Router();
const HospitalDischargeReport = require('../models/hospitalDischargeReportModel');
const verifyToken=require('../middleware');

// POST a new hospital discharge report
router.post('/hospitalDischargeReport', verifyToken, async (req, res) => {
    try {
        const report = new HospitalDischargeReport(req.body);
        await report.save();
        res.status(201).json({messge:"Hospital Discharge Report saved successfully",report});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/gethospitalDischargeReport', verifyToken, async(req,res)=>{
    try{
       const report=await HospitalDischargeReport.find();
       res.status(200).json(report);
    }catch(error){
        res.status(500).json({ message: "Internal server error!",error:error.message });
    }
})

router.get('/gethospitalDischargeReportbyEmail', verifyToken, async(req,res)=>{
    try{
        const {email,firstName, lastName}=req.user;
        const user=await Signup.findOne({email});
        if(!user){
            return res.status(404).send("User not found");
        }
        const report=await HospitalDischargeReport.find({patientName:email});
        if(!report || report.length==0){
            return res.status(404).send("No hospital discharge reports for this user");
        }
        const reportmentwithName = await Promise.all(report.map(async appoint => {
        return {
            ...appoint._doc,
            patientName: firstName + " " + lastName
    }
    }));  
       res.status(200).json(reportmentwithName);
    }catch(error){
        res.status(500).json({ message: "Internal server error!",error:error.message });
    }
})

module.exports = router;
