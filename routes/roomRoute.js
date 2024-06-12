const express = require('express');
const router = express.Router();
const Room = require('../models/roomModel');

router.post('postRoom/', async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('getRoom/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('getRoom/:id',  (req, res) => {
    res.json(res.room);
});

router.patch('patchRoom/:id',  async (req, res) => {
    if (req.body.name != null) {
        res.room.name = req.body.name;
    }
    if (req.body.description != null) {
        res.room.description = req.body.description;
    }
    if (req.body.bedCapacity != null) {
        res.room.bedCapacity = req.body.bedCapacity;
    }
    if (req.body.charge != null) {
        res.room.charge = req.body.charge;
    }
    if (req.body.status != null) {
        res.room.status = req.body.status;
    }

    try {
        const updatedRoom = await res.room.save();
        res.json(updatedRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('delRoom/:id',  async (req, res) => {
    try {
        await res.room.remove();
        res.json({ message: 'Deleted room' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
