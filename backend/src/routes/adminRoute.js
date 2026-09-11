import express from "express"
const adminRouter =express.Router();
import { addDoctor, allDoctors,appointmentsAdmin,cancelAppointment,adminDashboard  } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import {dataCheck} from "../middleware/check.js";
import {adminLogin } from "../controllers/adminAuth.js"
import {authAdmin } from "../middleware/adminAuth.js"
import { changeAvailablity } from "../controllers/doctorController.js";
import { authLimiter, expensiveLimiter } from "../middleware/rateLimiter.js";

adminRouter.post('/add-doctor',upload.single('image'),dataCheck,authAdmin,expensiveLimiter,addDoctor)
adminRouter.post('/login',authLimiter,adminLogin)
adminRouter.post("/all-doctors",authAdmin,allDoctors)
adminRouter.post("/change-availability",authAdmin,changeAvailablity)
adminRouter.get("/appointments",authAdmin,appointmentsAdmin)
adminRouter.post("/cancel-appointment",authAdmin,cancelAppointment)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
export default adminRouter