const express = require('express');
const app = express();
const connectDb = require('./db')
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
const doctorRouter = require('./routes/doctorRoute')
const departmentRoute = require('./routes/departmentRoute')
const roomRoute = require('./routes/roomRoute')
const bedRoute = require('./routes/bedRoute')
const patientRoutes = require('./routes/patientRoutes')
const emailRoutes = require('./routes/emailRoutes')
const symptoms = require('./routes/symptomsRoute')
const appointment = require('./routes/appointmentRoute')
const lab = require('./routes/labRoutes')
const schedule = require('./routes/scheduleRoutes')
const appoitntmentHistory = require('./routes/appointment-historyRoute')
const note = require('./routes/doctornoteRoute')
const prescriptionRoute = require('./routes/prescriptionRoute')
const doctorDischargeReportRoute = require('./routes/doctorDischargeReportRoute')
const hospitalDischargeReportRoute = require('./routes/hospitalDischargeReportRoute')
const userverification=require('./routes/userverification')
const appPrescription=require('./routes/appPrescription.routes')
const admissionPatientRoute=require('./routes/admissionPatientRoute')
const wardRouted=require('./routes/wardRouted')
const billRoutes=require('./routes/billRoutes')
const reportRoute=require('./routes/reportRoute')
const admitPatientPaymentsRoutes=require('./routes/admitPatientPaymentsRoutes')


app.use(express.json())
app.use(cors());
app.use(userRouter);
app.use(doctorRouter);
app.use(departmentRoute);
app.use(roomRoute);
app.use(patientRoutes);
app.use(bedRoute);
app.use(emailRoutes);
app.use(symptoms);
app.use(appointment);
app.use(lab);
app.use(appoitntmentHistory);
app.use(schedule);
app.use(hospitalDischargeReportRoute);
app.use(doctorDischargeReportRoute);
app.use(prescriptionRoute);
app.use(note);
app.use(userverification);
app.use(appPrescription);
app.use(admissionPatientRoute);
app.use(wardRouted);
app.use(billRoutes);
app.use(reportRoute);
app.use(admitPatientPaymentsRoutes);




app.listen(3000, () => {
    console.log('Localhost is connected to 3000')
})