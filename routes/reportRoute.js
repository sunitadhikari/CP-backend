const express = require('express');
const router = express.Router();
const Report = require('../models/reportModel');
const verifyToken=require('../middleware');
const { dailyReport } = require('../controllers/dailyEmail'); 
const Admission = require('../models/admissionPatientModel')


// router.post('/dailyReport', async (req, res) => {
//     try {
//       const report = new Report(req.body);
//       const savedReport = await report.save();
//       res.status(201).json(savedReport);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });
router.post('/dailyReport', async (req, res) => {
  try {
      // Create and save the report
      const report = new Report(req.body);
      const savedReport = await report.save();

      // Send the email
      await dailyReport(savedReport);

      res.status(201).json(savedReport);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});
// router.post('/dailyReport', async (req, res) => {
//   try {
//       // Create and save the report
//       const report = new Report(req.body);
//       const savedReport = await report.save();

//       // Send the email
//       await dailyReport(savedReport);

//       res.status(201).json(savedReport);
//   } catch (error) {
//       res.status(400).json({ message: error.message });
//   }
// });
  // Get all reports
  // router.get('/getDailyReport', async (req, res) => {
  //   try {
  //     const reports = await Report.find();
  //     res.status(200).json(reports);
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // });

  router.get('/getDailyReport', async (req, res) => {
    try {
      const report = await Report.find();
      if(!report || report.length=== 0){
        return res.status(404).send("Report not found");
      }
      const reports = await Promise.all(report.map(async rt => {
        const patient=await Admission.findOne({email:rt.patientEmail});
                return {
                    ...rt._doc,
                    patientEmail: patient.firstName + " " + patient.lastName
                }
            }
        ));  
      res.status(200).json(reports);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get a specific report by ID
  router.get('/dailyReport:id', async (req, res) => {
    try {
      const report = await Report.findById(req.params.id).populate('patient');
      if (!report) return res.status(404).json({ message: 'Report not found' });
      res.status(200).json(report);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Update a report
  router.put('/dailyReport:id', async (req, res) => {
    try {
      const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedReport) return res.status(404).json({ message: 'Report not found' });
      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a report
  router.delete('/dailyReport:id', async (req, res) => {
    try {
      const deletedReport = await Report.findByIdAndDelete(req.params.id);
      if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
      res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  module.exports = router;