const express = require('express');
const router = express.Router();
const Prescription = require('../models/appPrescription.model');

// Create a new prescription
router.post('/prescription', async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/pres', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
router.get('/prescriptions/:appointmentId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ appointmentId: req.params.appointmentId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/prescription/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/prescription/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/prescription/:id', async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
