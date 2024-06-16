const express = require('express');
const router = express.Router();
const Person = require('../models/patientModel');
const verifyToken=require('../middleware');


router.post('/postPatient',verifyToken, async (req, res) => {
    try {
        const person = new Person(req.body);
        await person.save();
        res.status(201).json(person);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/getPatient',verifyToken, async (req, res) => {
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/getPatientById:id',  (req, res) => {
    res.json(res.person);
});

router.patch('/patchPatient:id', verifyToken, async (req, res) => {
    if (req.body.firstName != null) {
        res.person.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.person.lastName = req.body.lastName;
    }

    try {
        const updatedPerson = await res.person.save();
        res.json(updatedPerson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/delPatient:id', verifyToken, async (req, res) => {
    try {
        await res.person.remove();
        res.json({ message: 'Deleted person' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
