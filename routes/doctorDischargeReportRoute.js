const express = require('express');
const router = express.Router();
const DoctorDischargeReport = require('../models/doctorDischargeReportModel');

router.post('/doctorDischargeReport', async (req, res) => {
    try {
        const report = new DoctorDischargeReport(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/doctorDischargeReport', async (req, res) => {
    try {
        const reports = await DoctorDischargeReport.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/doctorDischargeReport/:id', async (req, res) => {
    try {
        const report = await DoctorDischargeReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Doctor discharge report not found' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/doctorDischargeReport/:id', async (req, res) => {
    try {
        const deletedReport = await DoctorDischargeReport.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Doctor discharge report not found' });
        }
        res.json({ message: 'Doctor discharge report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/doctorDischargeReport/:id', async (req, res) => {
    try {
        const updatedReport = await DoctorDischargeReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Doctor discharge report not found' });
        }
        res.json(updatedReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
