const express = require('express');
const router = express.Router();
const Bed = require('../models/bedModel');
const verifyToken=require('../middleware');


// Create a bed
router.post('/postBed',verifyToken, async (req, res) => {
    try {
        const bed = new Bed(req.body);
        await bed.save();
        res.status(201).json(bed);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all beds
router.get('/getBed',verifyToken, async (req, res) => {
    try {
        const beds = await Bed.find();
        res.json(beds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one bed
router.get('getBedById/:id',verifyToken, getBed, (req, res) => {
    res.json(res.bed);
});

// Update one bed
router.patch('patchBed/:id',verifyToken, getBed, async (req, res) => {
    if (req.body.name != null) {
        res.bed.name = req.body.name;
    }
    if (req.body.bedNumber != null) {
        res.bed.bedNumber = req.body.bedNumber;
    }
    if (req.body.bedCapacity != null) {
        res.bed.bedCapacity = req.body.bedCapacity;
    }
    if (req.body.description != null) {
        res.bed.description = req.body.description;
    }
    if (req.body.status != null) {
        res.bed.status = req.body.status;
    }

    try {
        const updatedBed = await res.bed.save();
        res.json(updatedBed);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one bed
router.delete('delBed/:id', getBed, async (req, res) => {
    try {
        await res.bed.remove();
        res.json({ message: 'Deleted Bed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getBed(req, res, next) {
    let bed;
    try {
        bed = await Bed.findById(req.params.id);
        if (bed == null) {
            return res.status(404).json({ message: 'Cannot find bed' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.bed = bed;
    next();
}

module.exports = router;
