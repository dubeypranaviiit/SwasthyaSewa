import express from "express"
const doctorRouter =express.Router();
import { authDoctor } from "../middleware/authDoctor.js";
import { doctorList, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile } from "../controllers/doctorController.js"
import { loginDoctors } from "../controllers/doctorAuth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',authLimiter,loginDoctors)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)

export default doctorRouter