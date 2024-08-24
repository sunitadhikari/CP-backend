const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescriptionModel');
const verifyToken=require('../middleware');
const Signup= require('../models/userModel');
const Symptoms=require('../models/symptomsModel');

// router.post('/prescriptions', async (req, res) => {
//     try {
//       const { patientId, medicine, suggestion } = req.body;
//       const prescription = new Prescription({ patientId, medicine, suggestion });
//       await prescription.save();
//       res.status(201).json(prescription);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });
router.post('/prescriptions', async (req, res) => {
  try {
    const { patientId, medicine, suggestion } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const prescription = new Prescription({ patientId, medicine, suggestion });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// router.get('/getprescriptions', verifyToken, async (req, res) => {
//   try {
//     const symptoms = await Symptoms.find({patient:req.user.email});
//     if (!symptoms || symptoms.length === 0) {
//       return res.status(404).send('No symptoms for this patient');
//     }
//     const symptomIds = symptoms.map(symptom => symptom._id);

//     const prescriptions = await Prescription.find({ patientId: { $in: symptomIds } });
    
//     if (!prescriptions || prescriptions.length === 0) {
//       return res.status(404).json({ message: "No prescriptions found for this user" });
//     }

//     res.status(200).json(prescriptions);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


router.get('/getprescriptions', verifyToken, async (req, res) => {
  try {
    const symptoms = await Symptoms.find({ patient: req.user.email });
    if (!symptoms || symptoms.length === 0) {
      return res.status(404).send('No symptoms for this patient');
    }

    const result = await Promise.all(symptoms.map(async (symptom) => {
      const prescriptions = await Prescription.find({ patientId: symptom._id });
      return {
        Symptom:symptom.symptoms,
        prescriptions: prescriptions.length > 0 ? prescriptions : 'No prescriptions found for this symptom'
      };
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.get('/getPescribe', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get('/getPescribe', async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find().sort({ createdAt: -1 });
//     res.json(prescriptions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get('getppppppescribe/:id', async (req, res) => {
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
