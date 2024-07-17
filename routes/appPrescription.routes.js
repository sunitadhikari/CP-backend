const express = require('express');
const router = express.Router();
const Prescription = require('../models/appPrescription.model');
const Appointment = require('../models/appointmentModel');

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
//check gara hai 
// router.get('/prescriptionsByEmail', async (req, res) => {
//   try {
//     const patientEmail = req.user.email; 
//     const appointments = await Appointment.find({ email: email }).select('_id');
    
//     const appointmentIds = appointments.map(appointment => appointment._id);

//     const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
//     res.json(prescriptions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get('/prescriptionsByEmail', async (req, res) => {
  try {
    const patientEmail = req.user.email; 
    const appointments = await Appointment.find({ email: patientEmail }).select('_id');
    
    const appointmentIds = appointments.map(appointment => appointment._id);

    const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
