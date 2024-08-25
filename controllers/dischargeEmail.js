const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email provider
    auth: {
        user: 'sunitaadhikari2001@gmail.com', 
        pass: 'melo illm tkld mvyj',
    }
});

async function sendDischargeEmail(patientEmail, report) {
    const mailOptions = {
        from: 'sunitaadhikari2001@gmail.com',
        to: patientEmail,
        subject: 'Hospital Discharge Report',
        text: `
            Dear ${report.patientName},

            We hope this email finds you well. Below is the summary of your discharge from our hospital:

            Patient Name: ${report.patientName}
            Age: ${report.patientAge}
            Gender: ${report.patientGender}
            Department: ${report.department}
            Ward: ${report.ward}
            Bed Number: ${report.bedNumber}
            Admission Date: ${report.admissionDate}
            Discharge Date: ${report.dischargeDate}
            Final Diagnosis: ${report.finalDiagnosis}
            Summary of Treatment: ${report.summaryOfTreatment}
            Discharge Medications: ${report.dischargeMedications}
            Follow-Up Instructions: ${report.followUpInstructions}

            Thank you for trusting our hospital for your care.

            Best regards,
           Aspatal Hospital Management
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Discharge email sent successfully');
    } catch (error) {
        console.error('Error sending discharge email:', error.message);
        throw new Error('Failed to send discharge email');
    }
}

module.exports = { sendDischargeEmail };
