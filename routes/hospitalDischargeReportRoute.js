const express = require('express');
const router = express.Router();
const HospitalDischargeReport = require('../models/hospitalDischargeReportModel');

// POST a new hospital discharge report
router.post('/hospitalDischargeReport', async (req, res) => {
    try {
        const report = new HospitalDischargeReport(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
