// routes/bills.js

const express = require('express');
const router = express.Router();
const Bill = require('../models/BillModel');

// Route to update payment status
router.post('/update-payment-status', async (req, res) => {
  try {
    const { itemId, payload, amount } = req.body;
    // Here you can update the payment status in the relevant collection
    // For example, if you have an "Appointments" collection:
    // await Appointment.findByIdAndUpdate(itemId, { paymentStatus: 'Paid', paymentDetails: payload });
    res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Route to save bill details
router.post('/save-bill', async (req, res) => {
    try {
      const { patientName, patientAge, patientGender, admissionDate, dischargeDate, finalDiagnosis, summaryOfTreatment, dischargeMedications, followUpInstructions, paymentType, cashDetails } = req.body;
  
      // Create a new bill instance
      const newBill = new Bill({
        patientName,
        patientAge,
        patientGender,
        admissionDate,
        dischargeDate,
        finalDiagnosis,
        summaryOfTreatment,
        dischargeMedications,
        followUpInstructions,
        paymentType,
        paymentData: paymentType === 'cash' ? cashDetails : null,
        amount: paymentType === 'cash' ? parseFloat(cashDetails) : 0
      });
  
      // Save the bill to the database
      const savedBill = await newBill.save();
      res.status(201).json(savedBill);
    } catch (error) {
      console.error('Error saving bill:', error);
      res.status(500).json({ message: 'Failed to save bill' });
    }
  });
  
module.exports = router;
