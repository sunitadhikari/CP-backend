// routes/patients.js

const express = require('express');
const router = express.Router();
const Patient = require('../models/admissionPatientModel');
const Signup = require('../models/userModel');
const Beds = require('../models/bedModel');
const verifyToken=require('../middleware');

// router.get('/patients', async (req, res) => {
//   try {
//     const patients = await Patient.find();
//     const patientCount = await Patient.countDocuments({});

//     res.json({patients,patientCount});
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.get('/patients', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const dailyAdmittedPatients = await Patient.countDocuments({
      admittedAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    const patients = await Patient.find();
    const patientCount = await Patient.countDocuments({});

    res.json({ dailyAdmittedPatients, patients, patientCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/patients/:id/discharge', verifyToken, async (req, res) => {
  try {
    const { dischargeDate } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { dischargeDate },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const bed = await Bed.findOne({ ward: patient.ward, bedNumbers: patient.bedNumber });

    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    bed.occupied = false;
    await bed.save();

    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// router.put('/patients/:id/discharge', verifyToken, async (req, res) => {
//   try {
//     const patient = await Patient.findByIdAndUpdate(
//       req.params.id,
//       { dischargeDate: new Date() },
//       { new: true }
//     );
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.json(patient);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.post('/patients',verifyToken, async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/patients/:id',verifyToken, async (req, res) => {
  try {
    const {email}=req.user;
    const patient = await Patient.findByIdAndUpdate(req.params.id, {checkedBy:email}, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Get patients by department
router.get('/patients/department/:department', async (req, res) => {
  try {
    const patients = await Patient.find({ department: req.params.department });
    res.json(patients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/admittedpatientbyDepartment', verifyToken, async(req,res)=>{
  try{
    const {email}=req.user;
    const doctor = await Signup.findOne({email});
    if(!doctor){
      return res.status(404).send("Doctor not found!");
    }
    const patient = await Patient.find({department:doctor.department});
    if(!patient){
      return res.status(404).send("No patient found for this department");
    }
    res.status(200).json({message:`Patient for this department:`, patient});
  }catch(error){
    return res.status(500).send({message:"Internal Server error!",error:error.message});
  }
})

module.exports = router;
