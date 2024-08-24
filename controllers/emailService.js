// emailService.js

const nodemailer = require('nodemailer');

const sendAdmissionEmail = async (patient) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email service
            auth: {
                user: 'karthikpokharel@gmail.com',
                pass: 'nbqr tojp uufx ikgj',
            },
        });
        // email

        const mailOptions = {
            from:  'karthikpokharel@gmail.com',
            to: patient.email, // Send email to the patient's email
            subject: 'Admission Confirmation',
            text: `Dear ${patient.firstName} ${patient.lastName},\n\nYou have been successfully admitted to the ${patient.department} department. Your bed number is ${patient.bedNumber} in ward ${patient.ward}. Please feel free to contact us for further assistance.\n\nBest regards,\nYour Hospital Name`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

module.exports = {
    sendAdmissionEmail,
};
