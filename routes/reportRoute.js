// const express = require('express');
// const router = express.Router();
// const verifyToken=require('../middleware');
// const DoctorDischargeReport = require('../models/doctorDischargeReportModel');

// router.createReport = async (req, res) => {
//     try {
//         const newReport = new DoctorDischargeReport({ ...req.body, email: req.user.email });
//         const savedReport = await newReport.save();
//         res.status(201).json(savedReport);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.getReports = async (req, res) => {
//     try {
//         const reports = await DoctorDischargeReport.find({ email: req.user.email });
//         res.status(200).json(reports);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.getReport = async (req, res) => {
//     try {
//         const report = await DoctorDischargeReport.findById(req.params.id);
//         if (!report) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.status(200).json(report);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.updateReport = async (req, res) => {
//     try {
//         const updatedReport = await DoctorDischargeReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedReport) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.status(200).json(updatedReport);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.deleteReport = async (req, res) => {
//     try {
//         const deletedReport = await DoctorDischargeReport.findByIdAndDelete(req.params.id);
//         if (!deletedReport) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.status(200).json({ message: 'Report deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const HospitalDischargeReport = require('../models/hospitalDischargeReportModel');

// router.createReport = async (req, res) => {
//     try {
//         const newReport = new HospitalDischargeReport({ ...req.body, email: req.user.email });
//         const savedReport = await newReport.save();
//         res.status(201).json(savedReport);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.getReports = async (req, res) => {
//     try {
//         const reports = await HospitalDischargeReport.find({ email: req.user.email });
//         res.status(200).json(reports);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.getReport = async (req, res) => {
//     try {
//         const report = await HospitalDischargeReport.findById(req.params.id);
//         if (!report) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.status(200).json(report);
//     } catch (error) {
//         return res.json({ message: 'Internal server error' });
//     }
// };

// router.updateReport = async (req, res) => {
//     try {
//         const updatedReport = await HospitalDischargeReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedReport) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.status(200).json(updatedReport);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// router.deleteReport = async (req, res) => {
//     try {
//         const deletedReport = await HospitalDischargeReport.findByIdAndDelete(req.params.id);
//         if (!deletedReport) {
//             return res.status(404).json({ message: 'Report not found' });
//         }
//         res.status(200).json({ message: 'Report deleted successfully' });
//     } catch (error) {
//         return res.json({ message: 'Internal server error' });
//     }
// };
