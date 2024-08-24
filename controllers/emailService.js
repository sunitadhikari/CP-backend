
const nodemailer = require('nodemailer');

const sendAdmissionEmail = async (patient) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'sunitaadhikari2001@gmail.com', 
                pass: 'melo illm tkld mvyj',
              }
        });

        const mailOptions = {
            from:  'sunitaadhikari2001@gmail.com',
            to: patient.email, 
            subject: 'Admission Confirmation',
            text: `Dear ${patient.firstName} ${patient.lastName},
            \n\nYou have been successfully admitted to the ${patient.department} department. 
            Your bed number is ${patient.bedNumber} in ward ${patient.ward}. 
            Please feel free to contact us for further assistance. 
            Thank you for trusting our hospital for your care.

            Best regards,
           Aspatal Hospital Management`,
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
