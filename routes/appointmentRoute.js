const express = require('express');
const router = express.Router();
const appointments = require('../models/appointmentModel');
const Signup= require('../models/userModel');
const verifyToken = require('../middleware');


router.post('/postAppointment', verifyToken, async (req, res) => {
    try {
        // Ensure the email is added to the appointment data
        const appointmentData = {
            ...req.body,
            email: req.user.email
        };

        // Create and save the appointment
        const appointment = new appointments(appointmentData);
        await appointment.save();
        console.log('Appointment is saved');

        // Retrieve all appointments for the user's email
        // const userAppointments = await appointments.find({ email: req.user.email });

        // if (!userAppointments.length) {
        //     return res.status(404).json({ message: 'No appointments found for this user' });
        // }

        // Respond with the saved appointment and all user's appointments
        res.json({
            message: 'Appointment is saved',
            appointment,
            userAppointments
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error saving appointment', error });
    }
});

router.get('/getAppointment', async (req, res) => {
    try {
        const appointment = await appointments.find();
        res.send(appointment)
    }
    catch (error) {
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
router.get('/getAppointmentsByDoctorEmail', verifyToken, async (req, res) => {
    try {
        const doctorEmail = req.user.email; // Assuming doctor's email is in req.user.email
        const appointments = await Appointment.find({ email: doctorEmail });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});
module.exports = router;