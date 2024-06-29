const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescriptionModel');
const verifyToken=require('../middleware');

router.post('/prescriptions', async (req, res) => {
    try {
      const { patientId, medicine, suggestion } = req.body;
      const prescription = new Prescription({ patientId, medicine, suggestion });
      await prescription.save();
      res.status(201).json(prescription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.get('/getPescribe', async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('getPescribe/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('delPescribe/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('putPescribe/:id', async (req, res) => {
  try {
    const { medicine, suggestion } = req.body;
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { medicine, suggestion },
      { new: true }
    );
    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(updatedPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
