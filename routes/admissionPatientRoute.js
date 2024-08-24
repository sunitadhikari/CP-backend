// routes/patients.js

const express = require('express');
const router = express.Router();
const Patient = require('../models/admissionPatientModel');
const Signup = require('../models/userModel');
const Beds = require('../models/bedModel');
const verifyToken=require('../middleware');
const { sendAdmissionEmail } = require('../controllers/emailService');


router.post('/patients', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email,dob, gender, contactNumber,address, medicalHistory, department, bedNumber, ward,  dischargeDate, isActive, checkedBy } = req.body;

    const bed = await Beds.findOne({ bedNumbers: bedNumber, ward: ward });

    if (!bed) {
      console.log('Bed not found in the specified ward');
      return res.status(400).json({ error: 'Bed not found in the specified ward' });
    } else {
      console.log(`Bed Details: ${JSON.stringify(bed)}`);
      console.log(`Bed Occupancy Status: ${bed.occupied} (Type: ${typeof bed.occupied})`);

      if (bed.occupied === true) {
        console.log(`Bed ${bed.bedNumbers} in ward ${bed.ward} is already occupied`);
        return res.status(400).json({ error: 'Bed is already occupied', bedDetails: bed });
      } else {
        const patient = new Patient({
          firstName, lastName,email, dob,address, gender, contactNumber, medicalHistory, department, bedNumber, ward,  dischargeDate, isActive, checkedBy
        });
        await patient.save();
        bed.occupied = true;
        await bed.save();
        await sendAdmissionEmail(patient);
        console.log('Patient admitted successfully');
        return res.status(201).json(patient);
      }
    }
  } catch (err) {
    console.error('Error during patient admission:', err.message);
    return res.status(400).json({ error: err.message });
  }
});


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

    const patient = await Patient.find();
    const patientCount = await Patient.countDocuments({});

    const patients = await Promise.all(patient.map(async admit => {
                  
      const doctor = await Signup.findOne({ email: admit.checkedBy });
      return {
          ...admit._doc,
          checkedBy: doctor.firstName + " " + doctor.lastName
      };
  }));  

    res.json({ dailyAdmittedPatients,patients, patientCount });
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

    const bed = await Beds.findOne({ ward: patient.ward, bedNumbers: patient.bedNumber });

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
// router.post('/patients', verifyToken, async (req, res) => {
//   try {
//     const { bedNumber, ...patientData } = req.body;

//     // Find the bed with the provided bedNumber
//     const bed = await Beds.findOne({ bedNumbers: bedNumber });
    
//     if (!bed) {
//       return res.status(400).json({ error: 'Bed not found' });
//     }

//     if (bed.occupied === true) {
//       return res.status(400).json({ error: 'Bed is already occupied' });
//     }

//     // Create and save the patient if the bed is available
//     const patient = new Patient(patientData);
//     await patient.save();

//     // Update the bed status to occupied
//     bed.occupied = true;
//     await bed.save();

//     res.status(201).json(patient);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


// router.post('/patients',verifyToken, async (req, res) => {
//   try {
//     const { firstName, lastName, dob, gender, contactNumber,medicalHistory, department, bedNumber, admittedAt, dischargeDate,isActive, checkedBy } = req.body;
//     const patient = new Patient(req.body);
//     await patient.save();
//     res.status(201).json(patient);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

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
