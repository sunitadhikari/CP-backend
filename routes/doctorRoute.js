const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctorModel');
const verifyToken=require('../middleware');


router.post('/addDoctor',verifyToken, async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).send(doctor);
  }
  catch (error) {
    res.status(400).send(error);
  }
});

router.get('/getDoctor',verifyToken, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.send(doctors);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/getDoctor:id',verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).send();
    }
    res.send(doctor);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/updateDoctor:id',verifyToken, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password', 'department', 'picture', 'dob', 'sex', 'bloodGroup', 'designation', 'address', 'phoneNo', 'mobileNo', 'careerTitle', 'biography', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).send();
    }

    updates.forEach((update) => (doctor[update] = req.body[update]));
    await doctor.save();
    res.send(doctor);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/delDoctor/:id', verifyToken, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).send();
    }

    res.send(doctor);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
