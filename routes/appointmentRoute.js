const express = require('express');
const router = express.Router();
const appointments = require('../models/appointmentModel');
const Signup= require('../models/userModel');
const verifyToken = require('../middleware');

router.post('/postAppointment', verifyToken, async (req, res) => {
    const email = req.user.email;
    const username = req.user.username;
    const {departmentName, doctorname, date, time, phone, problem } = req.body;
    
    const appointment = new appointments({
        username,
        email,
        departmentName,
        doctorname,
        date,
        time,
        phone,
        problem,
        isPaid: false
      });
    
      try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
    
    router.get('/appointments', async (req, res) => {
      try {
        const appointmentList = await appointments.find();
        res.send(appointmentList);
      } catch (error) {
        res.status(400).send(error);
      }
    });
router.get('/appointmentsByEmail', verifyToken, async (req, res) => {
    try {
        const email = req.user.email; // Ensure the token contains the email

        const userAppointments = await appointments.find({ email });

        if (!userAppointments) { 
            return res.status(404).json({ message: 'No appointments found for this user' });
        }

        res.json({ userAppointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/updatePaymentStatus', verifyToken, async (req, res) => {
  const { id, payload } = req.body;

  try {
    const appointment = await Appointments.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.isPaid = true;
    appointment.paymentDetails = payload; // Optionally save payment details

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
});
router.get('/appointment', verifyToken, async (req, res) => {
    try {
        const doctorEmail = req.user.email; // Assuming doctor's email is in req.user.email
        const appointment = await appointments.find({ email: doctorEmail });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});
router.get('/docAppointmentsEmail', verifyToken, async (req, res) => {
  try {
    const doctorEmail = req.user.email; 
    const user = await Signup.findOne({ email: doctorEmail });
    if (!user) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentList = await appointments.find({ doctorname: doctorEmail });
    res.json(appointmentList);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/delAppointment/:id', verifyToken, async(req,res)=>{
  try{
    const appointment = await appointments.findById(req.params.id);
    if(!appointment){
      return res.status(404).send();
    }
    res.status(appointment);
  }
  catch(error){
    res.status(500).send(error);
  }
})
module.exports = router;