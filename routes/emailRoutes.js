const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const multer = require('multer');
const upload = multer();

router.post('/send-email', upload.array('attachments'), emailController.sendEmail);

// router.post('/send-email', emailController.sendEmail);

module.exports = router;
