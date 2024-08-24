const express = require('express');
const router = express.Router();
const HospitalDischargeReport = require('../models/hospitalDischargeReportModel');
const Bed = require('../models/bedModel'); 
const DoctorDischargeReport = require('../models/doctorDischargeReportModel');

const verifyToken=require('../middleware');

// POST a new hospital discharge report
// router.post('/hospitalDischargeReport', verifyToken, async (req, res) => {
//     try {
//         const report = new HospitalDischargeReport(req.body);
//         await report.save();
//         res.status(201).json({messge:"Hospital Discharge Report saved successfully",report});
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
 

// router.post('/hospitalDischargeReport', verifyToken, async (req, res) => {
//     try {
//         // Create and save the discharge report
//         const report = new HospitalDischargeReport(req.body);
//         await report.save();

//         // Update the bed status
//         const { ward, bedNumber } = req.body; // Ensure req.body contains ward and bedNumber

//         const bed = await Bed.findOne({ ward, bedNumbers: bedNumber });
//         if (!bed) {
//             return res.status(404).json({ message: 'Bed not found' });
//         }

//         bed.occupied = false;
//         await bed.save();

//         res.status(201).json({
//             message: 'Hospital Discharge Report saved successfully and bed status updated',
//             report
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Route for handling hospital discharge report submission
router.post('/hospitalDischargeReport', verifyToken, async (req, res) => {
    try {
        // Create and save the discharge report
        const report = new HospitalDischargeReport(req.body);
        await report.save();

        // Update the patient document
        const { patientId } = req.body;
        await DoctorDischargeReport.findByIdAndUpdate(patientId, { dischargeRequest: false });

        // Update the bed status
        const { ward, bedNumber } = req.body;
        const bed = await Bed.findOne({ ward, bedNumbers: bedNumber });
        if (!bed) {
            return res.status(404).json({ message: 'Bed not found' });
        }

        bed.occupied = false;
        await bed.save();

        res.status(201).json({
            message: 'Hospital Discharge Report saved successfully and bed status updated',
            report
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.post('/hospitalDischargeReport', verifyToken, async (req, res) => {
//     try {
//         // Create and save the discharge report
//         const report = new HospitalDischargeReport(req.body);
//         await report.save();

//         // Update the bed status
//         const { ward, bedNumber, patientId } = req.body; // Ensure req.body contains ward, bedNumber, and patientId

//         const bed = await Bed.findOne({ ward, bedNumbers: bedNumber });
//         if (!bed) {
//             return res.status(404).json({ message: 'Bed not found' });
//         }

//         bed.occupied = false;
//         await bed.save();

//         // Update dischargeRequest field in the Patient model
//         await DoctorDischargeReport.findByIdAndUpdate(patientId, { dischargeRequest: false });

//         res.status(201).json({
//             message: 'Hospital Discharge Report saved successfully, bed status updated, and patient dischargeRequest set to false',
//             report
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


router.get('/gethospitalDischargeReport', verifyToken, async(req,res)=>{
    try{
       const report=await HospitalDischargeReport.find({ hospitalDischargeRequest: true });
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
