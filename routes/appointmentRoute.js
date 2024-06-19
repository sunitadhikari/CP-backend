const express = require('express');
const router = express.Router();
const appointments = require('../models/appointmentModel');

router.post('/postAppointment', async (req, res) => {
    try {
        const appointmnet = new appointments(req.body);
        await appointmnet.save();
        // res.stauts(201).send(appointment);
        res.json({message:'appointment is send'})
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
})
module.exports = router;