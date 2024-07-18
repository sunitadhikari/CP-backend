const express = require('express');
const router = express.Router();
const Bed = require('../models/bedModel')
const Department = require('../models/departmentModel'); 
const mongoose = require('mongoose'); 




router.get('/beds', async (req, res) => {
    try {
      const beds = await Bed.find();
      res.json(beds);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
router.get('/getCountbeds', async (req, res) => {
  try {
    const occupiedBeds = await Bed.countDocuments({ occupied: true });
    const unoccupiedBeds = await Bed.countDocuments({ occupied: false });

    const beds = await Bed.find();
    const bedCount = await Bed.countDocuments({});

    res.json({ occupiedBeds, unoccupiedBeds,  bedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//   router.put('/beds/:id/update-occupied-status', async (req, res) => {
//     const { id } = req.params;
//     const { occupied } = req.body;
  
//     try {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({ message: 'Invalid bed ID' });
//       }
  
//       const updatedBed = await Bed.findByIdAndUpdate(id, { occupied }, { new: true });
  
//       if (!updatedBed) {
//         return res.status(404).json({ message: 'Bed not found' });
//       }
  
//       res.json(updatedBed);
//     } catch (err) {
//       console.error('Error updating bed status:', err);
//       res.status(500).json({ error: 'Failed to update bed status' });
//     }
//   });
router.put('/beds/:bedNumber/update-occupied-status', async (req, res) => {
    const { bedNumber } = req.params;
    const { occupied } = req.body;
  
    try {
      const updatedBed = await Bed.findOneAndUpdate({ bedNumbers: bedNumber }, { occupied }, { new: true });
  
      if (!updatedBed) {
        return res.status(404).json({ message: 'Bed not found' });
      }
  
      res.json(updatedBed);
    } catch (err) {
      console.error('Error updating bed status:', err);
      res.status(500).json({ error: 'Failed to update bed status' });
    }
  });
  router.post('/add-bed', (req, res) => {
    const { ward, bedNumbers, charges,occupied} = req.body;
    
    const newBed = new Bed({
      ward,
      bedNumbers,
      charges,
      occupied
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
