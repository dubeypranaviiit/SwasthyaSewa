import express from "express"
const adminRouter =express.Router();
import { addDoctor, allDoctors,appointmentsAdmin,cancelAppointment,adminDashboard  } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import {dataCheck} from "../middleware/check.js";
import {adminLogin } from "../controllers/adminAuth.js"
import {authAdmin } from "../middleware/adminAuth.js"
import { changeAvailablity } from "../controllers/doctorController.js";

adminRouter.post('/add-doctor',upload.single('image'),dataCheck,authAdmin,addDoctor)
adminRouter.post('/login',adminLogin)
adminRouter.post("/all-doctors",authAdmin,allDoctors)
adminRouter.post("/change-availability",authAdmin,changeAvailablity)
adminRouter.get("/appointments",authAdmin,appointmentsAdmin)
adminRouter.post("/cancel-appointment",authAdmin,cancelAppointment)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
export default adminRouter