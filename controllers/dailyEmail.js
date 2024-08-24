// services/emailService.js

const nodemailer = require('nodemailer');

const dailyReport = async (report) => {
    try {
        // Create a transporter object using your email service
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Replace with your email service
            auth: {
                user: 'karthikpokharel@gmail.com', // Replace with your email
                pass: 'nbqr tojp uufx ikgj', // Replace with your email password or app-specific password
            },
        });

        // Prepare the email options
        const mailOptions = {
            from: 'karthikpokharel@gmail.com', // Replace with your email
            to: report.patientEmail, // Send email to the patient's email
            subject: 'Daily Report',
            text: `A daily report has been created for you:
            
            Date: ${report.date}
            Symptoms: ${report.symptoms}
            Diagnosis: ${report.diagnosis}
            Treatment: ${report.treatment}
            Thank you for trusting our hospital for your care.

            Best regards,
            Aspatal Hospital Management`
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

module.exports = {
    dailyReport
};
