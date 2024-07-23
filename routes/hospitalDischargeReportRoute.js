const express = require('express');
const router = express.Router();
const HospitalDischargeReport = require('../models/hospitalDischargeReportModel');
const verifyToken=require('../middleware');
const Signup = require('../models/userModel');
const AdmissionPatient= require('../models/admissionPatientModel');
const Bed = require('../models/bedModel');

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

router.get('/gethospitalDischargeReport', async (req, res) => {
    try {
        const reports = await HospitalDischargeReport.find();

        const reportWithDetails = await Promise.all(reports.map(async report => {
            const [firstName, lastName] = report.patientName.split(' ');
            const user = await Signup.findOne({ firstName, lastName });
            if (!user ) {
                return { ...report._doc, error: "Patient not found" };
            }

            const admissionData = await AdmissionPatient.findOne({ firstName: user.firstName, lastName: user.lastName });
            if (!admissionData) {
                return { ...report._doc, error: "Admission Data not found for this patient" };
            }

            const bedData = await Bed.findOne({ bedNumbers: admissionData.bedNumber });
            if (!bedData) {
                return { ...report._doc, error: "No bed found for this user" };
            }

            return {
                ...report._doc,
                    //firstName: user.firstName,
                    //lastName: user.lastName,
                    email: user.email,
                    department: admissionData.department,
                    ward: bedData.ward,
                    bedNumber: bedData.bedNumbers,
                    charges: bedData.charges,
                    admittedAt: admissionData.admittedAt,
                    dischargeDate: admissionData.dischargeDate,
                    checkedBy: admissionData.checkedBy
                // patientDetails: {
                //     firstName: user.firstName,
                //     lastName: user.lastName,
                //     email: user.email,
                // },
                // bedDetails: {
                //     ward: bedData.ward,
                //     bedNumber: bedData.bedNumbers,
                //     charges: bedData.charges,
                //     occupied: bedData.occupied
                // },
                // admissionDetails: {
                //     department: admissionData.department,
                //     ward: admissionData.ward,
                //     bedNumber: admissionData.bedNumber,
                //     admittedAt: admissionData.admittedAt,
                //     dischargeDate: admissionData.dischargeDate,
                //     checkedBy: admissionData.checkedBy
                // }
            };
        }));

        res.status(200).json(reportWithDetails);
    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error.message });
    }
});

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
