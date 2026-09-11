import express from "express"
import { signUp, login, sendOtp, verifyOtpAndSignup } from "../controllers/userAuth.js";
import { getProfile, updateProfile, saveCheckup, getCheckups } from "../controllers/userController.js"
import { authUser } from "../middleware/authUser.js"
import upload from "../middleware/multer.js";
import { bookAppointment, listAppointment, cancelAppointment } from "../controllers/userAppointment.js";
import { paymentRazorPay, verifyRazorPay, checkRefundStatus } from "../controllers/userPayment.js";
import {
    authLimiter,
    otpSendLimiterByIp,
    otpSendLimiterByEmail,
    otpVerifyLimiterByIp,
    otpVerifyLimiterByEmail,
    appointmentLimiter,
    cancellationLimiter,
    paymentLimiter,
    expensiveLimiter,
} from "../middleware/rateLimiter.js";
const userRouter = express.Router();

userRouter.get('/list-appointment', upload.none(), authUser, listAppointment)
userRouter.get('/profile', upload.none(), authUser, getProfile)
userRouter.post('/signUp', upload.none(), authLimiter, signUp)
userRouter.post('/login', upload.none(), authLimiter, login)
userRouter.post('/send-otp', upload.none(), otpSendLimiterByIp, otpSendLimiterByEmail, sendOtp)
userRouter.post('/verify-otp-signup', upload.none(), otpVerifyLimiterByIp, otpVerifyLimiterByEmail, verifyOtpAndSignup)
userRouter.post('/update-profile', upload.single('image'), authUser, expensiveLimiter, updateProfile)
userRouter.post('/book-appointment', upload.none(), authUser, appointmentLimiter, bookAppointment)
userRouter.post('/cancel-appointment', upload.none(), authUser, cancellationLimiter, cancelAppointment)
userRouter.post('/payment-razorpay', upload.none(), authUser, paymentLimiter, paymentRazorPay)
userRouter.post('/verify-razorpay', upload.none(), authUser, paymentLimiter, verifyRazorPay)
userRouter.get('/refund-status/:appointmentId', upload.none(), authUser, checkRefundStatus)
userRouter.post('/save-checkup', upload.none(), authUser, expensiveLimiter, saveCheckup)
userRouter.get('/checkups', upload.none(), authUser, getCheckups)
export default userRouter
