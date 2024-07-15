// routes/beds.js

const express = require('express');
const router = express.Router();
const Bed = require('../models/bedModel');
const Department = require('../models/departmentModel'); 




router.get('/beds', async (req, res) => {
    try {
      const beds = await Bed.find();
      res.json(beds);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  router.post('/add-bed', (req, res) => {
    const { department, bedNumbers, charges } = req.body;
    
    const newBed = new Bed({
      department,
      bedNumbers,
      charges
    });
  
    newBed.save()
      .then(savedBed => {
        res.status(201).json(savedBed);
      })
      .catch(error => {
        console.error('Error saving bed:', error);
        res.status(500).json({ error: 'Failed to save bed' });
      });
  });

  router.put('/beds/:id/occupy', async (req, res) => {
    try {
      const bed = await Bed.findById(req.params.id);
      if (!bed) return res.status(404).json({ error: 'Bed not found' });
  
      if (bed.isOccupied) {
        return res.status(400).json({ error: 'Bed already occupied' });
      }
  
      bed.isOccupied = true;
      await bed.save();
      res.json(bed);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

module.exports = router;
