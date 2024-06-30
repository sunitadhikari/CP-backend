const express = require('express');
const router = express.Router();
const Bed = require('../models/bedModel');
const Room = require('../models/roomModel');
const verifyToken=require('../middleware');


router.post('/postBed', verifyToken, async (req, res) => {
    try {
        const { name, bedNumber } = req.body;

        const room = await Room.findOne({ name });

        if (!room) {
            return res.status(404).json({ message: `Room with name '${name}' not found` });
        }

        if (bedNumber > room.bedCapacity) {
            return res.status(400).json({ message: `Bed number ${bedNumber} exceeds the bed capacity of room '${name}' (${room.bedCapacity})` });
        }

        // Create new bed
        const bed = new Bed({
            name,
            bedNumber,
            description: req.body.description,
            charge: req.body.charge,
            status: req.body.status
        });

        // Save bed to database
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
router.get('/getBedById/:id',verifyToken, getBed, (req, res) => {
    res.json(res.bed);
});

// Update one bed
router.patch('/patchBed/:id',verifyToken, getBed, async (req, res) => {
    if (req.body.name != null) {
        res.bed.name = req.body.name;
    }
    if (req.body.bedNumber != null) {
        res.bed.bedNumber = req.body.bedNumber;
    }
    if (req.body.bedCapacity != null) {
        res.bed.bedCapacity = req.body.bedCapacity;
    }
    if (req.body.charge != null) {
        res.bed.charge = req.body.charge;
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

router.delete('/delBed/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const bed = await Bed.findByIdAndDelete(id);
        
        if (!bed) {
            return res.status(404).json({ message: 'Bed not found' });
        }
        
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
