const mongoose = require('mongoose');

const admitPatientPaymentSchema = new mongoose.Schema({
  idx: { type: String, required: true },
  token: { type: String, required: true },
  amount: { type: Number, required: true },
  mobile: { type: String, required: true },
  product_identity: { type: String, required: true },
  product_name: { type: String, required: true },
  product_url: { type: String, required: true },
  widgetId: { type: String, required: false },          // Changed to optional
  transaction_pin: { type: String, required: false },   // Changed to optional
  source: { type: String, required: false },            // Changed to optional
  public_key: { type: String, required: false }         // Changed to optional
});

module.exports = mongoose.model('AdmitPatientPayment', admitPatientPaymentSchema);
