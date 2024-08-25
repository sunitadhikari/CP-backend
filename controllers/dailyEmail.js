
const nodemailer = require('nodemailer');

const dailyReport = async (report) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'sunitaadhikari2001@gmail.com', 
                pass: 'melo illm tkld mvyj',
            },
        });

        // Prepare the email options
        const mailOptions = {
            from: 'sunitaadhikari2001@gmail.com',  
            to: report.patientEmail, 
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
