import express from "express"
import { signUp, login, sendOtp, verifyOtpAndSignup } from "../controllers/userAuth.js";
import { getProfile, updateProfile, saveCheckup, getCheckups } from "../controllers/userController.js"
import { authUser } from "../middleware/authUser.js"
import upload from "../middleware/multer.js";
import { bookAppointment, listAppointment, cancelAppointment } from "../controllers/userAppointment.js";
import { paymentRazorPay, verifyRazorPay, checkRefundStatus } from "../controllers/userPayment.js";
const userRouter = express.Router();

userRouter.get('/list-appointment', upload.none(), authUser, listAppointment)
userRouter.get('/profile', upload.none(), authUser, getProfile)
userRouter.post('/signUp', upload.none(), signUp)
userRouter.post('/login', upload.none(), login)
userRouter.post('/send-otp', upload.none(), sendOtp)
userRouter.post('/verify-otp-signup', upload.none(), verifyOtpAndSignup)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', upload.none(), authUser, bookAppointment)
userRouter.post('/cancel-appointment', upload.none(), authUser, cancelAppointment)
userRouter.post('/payment-razorpay', upload.none(), authUser, paymentRazorPay)
userRouter.post('/verify-razorpay', upload.none(), authUser, verifyRazorPay)
userRouter.get('/refund-status/:appointmentId', upload.none(), authUser, checkRefundStatus)
userRouter.post('/save-checkup', upload.none(), authUser, saveCheckup)
userRouter.get('/checkups', upload.none(), authUser, getCheckups)
export default userRouter
