const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karthikpokharel@gmail.com',
    pass: 'nbqr tojp uufx ikgj',
  }
});

exports.sendEmail = (req, res) => {
  const { to, subject, message } = req.body;

  const mailOptions = {
    from: 'karthikpokharel@gmail.com',
    to,
    subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }
    res.status(200).json({ message: 'Email sent successfully', info });
  });
};
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const upload = multer();  // for handling multipart/form-data

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   }
// });

// exports.sendEmail = (req, res) => {
//   const { to, subject, message } = req.body;

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to,
//     subject,
//     text: message,
//     attachments: req.files.map(file => ({
//       filename: file.originalname,
//       content: file.buffer
//     }))
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ error: 'Failed to send email', details: error });
//     }
//     res.status(200).json({ message: 'Email sent successfully', info });
//   });
// };
