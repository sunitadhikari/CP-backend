const express = require('express');
const router = express.Router();
const Payment = require('../models/admitPatientPayments');
const HospitallDischargeReport = require('../models/hospitalDischargeReportModel');



// router.post('/admit-patient-payment', async (req, res) => {
//     try {
//     const paymentData = new Payment(req.body);
//     await paymentData.save();
//     res.status(201).json({ message: 'Payment data saved successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving payment data', error });
//   }
// });
router.post('/admit-patient-payment', async (req, res) => {


  try {
    // Save payment data
    const paymentData = new Payment(req.body);
    await paymentData.save({  });

    // Update the corresponding patient record
    const { product_identity } = req.body; 
    await HospitallDischargeReport.findByIdAndUpdate(product_identity, { isPaid: true });



    res.status(201).json({ message: 'Payment data saved and patient status updated successfully' });
  } catch (error) {
 

    res.status(500).json({ message: 'Error saving payment data and updating patient status', error });
  }
});


router.get('/admit-patient-payments', async (req, res) => {
    try {
      const payments = await Payment.find(); // Fetch all payment records
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving payment data', error });
    }
  });
  router.get('/admit-patient-payments/count', async (req, res) => {
    try {
      const count = await Payment.countDocuments(); // Get the count of payment records
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving payment count', error });
    }
  });
module.exports = router;
