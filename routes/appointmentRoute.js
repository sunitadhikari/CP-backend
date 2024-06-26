const express = require('express');
const router = express.Router();
const appointments = require('../models/appointmentModel');
const Signup= require('../models/userModel');
const verifyToken = require('../middleware');


router.post('/postAppointment', async (req, res) => {
    try {
        const appointmnet = new appointments(req.body);
        await appointmnet.save();
        // res.stauts(201).send(appointment);
        res.json({ message: 'appointment is send' })
        console.log('appointmet is saved');
    }
    catch (error) {
        res.status(400).send(error);
    }
}
);
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
        const email = req.user.email; 

        const userAppointments = await appointments.find({ email });

        if (!userAppointments.length) { 
            return res.status(404).json({ message: 'No appointments found for this user' });
        }

        res.json({ userAppointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;