import Appointment from "../models/appointment.models.js";
import doctorModel from "../models/doctor.models.js"
import userModel from "../models/user.models.js"
import mongoose from "mongoose";
import { razorpayInstance } from "../config/razorpay.js";
import { v4 as uuidv4 } from "uuid";
import { sendBookingConfirmation, sendCancellationEmail, sendRefundNotification } from "../services/emailService.js";

const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime, checkupReport, consultationType } = req.body
        if (!userId || !docId || !slotDate || !slotTime) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const docData = await doctorModel.findById(docId).select('-password')
        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            })
        }

        if (docData.available === false) {
            return res.status(403).json({
                success: false,
                message: "Doctor not available"
            })
        }

        const updatedDoctor = await doctorModel.findOneAndUpdate(
            {
                _id: docId,
                available: { $ne: false },
                [`slots_booked.${slotDate}`]: { $ne: slotTime }
            },
            {
                $push: { [`slots_booked.${slotDate}`]: slotTime }
            },
            { new: true }
        )

        if (!updatedDoctor) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked by another user. Please choose a different slot."
            })
        }

        const userData = await userModel.findById(new mongoose.Types.ObjectId(userId)).select('-password');
        if (!userData) {
            await doctorModel.findByIdAndUpdate(docId, {
                $pull: { [`slots_booked.${slotDate}`]: slotTime }
            })
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        delete docData.slots_booked

        let parsedCheckupReport = null
        if (checkupReport) {
            try {
                parsedCheckupReport = typeof checkupReport === 'string' ? JSON.parse(checkupReport) : checkupReport
            } catch (e) {
                parsedCheckupReport = checkupReport
            }
        }

        const type = consultationType === 'online' ? 'online' : 'offline'
        let amount = docData.fees
        if (type === 'online') {
            amount = Math.round(docData.fees * 0.8)
        }

        let videoCallId = null
        let videoCallLink = null
        if (type === 'online') {
            videoCallId = `swasthya-${uuidv4().slice(0, 12)}`
        }

        const appointmentData = {
            userId,
            docId,
            userData,
            slotDate,
            slotTime,
            docData,
            amount,
            date: Date.now(),
            checkupReport: parsedCheckupReport,
            consultationType: type,
            videoCallId,
            videoCallLink
        }

        try {
            const newAppointment = new Appointment(appointmentData)
            const savedAppointment = await newAppointment.save();

            if (type === 'online') {
                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
                videoCallLink = `${frontendUrl}/video-call/${savedAppointment._id}`
                await Appointment.findByIdAndUpdate(savedAppointment._id, { videoCallLink })
            }

            if (userData.email) {
                sendBookingConfirmation(userData.email, {
                    docName: docData.name,
                    slotDate,
                    slotTime,
                    amount,
                    consultationType: type,
                    videoCallLink
                }).catch(err => console.error("Booking email failed:", err))
            }

            return res.status(200).json({
                success: true,
                message: `Appointment booked successfully`,
                appointmentId: savedAppointment._id,
                consultationType: type,
                videoCallLink: type === 'online' ? videoCallLink : null
            })
        } catch (saveError) {
            await doctorModel.findByIdAndUpdate(docId, {
                $pull: { [`slots_booked.${slotDate}`]: slotTime }
            })
            throw saveError
        }
    } catch (error) {
        console.log('booking error:', error);
        return res.status(500).json({
            success: false,
            message: "Please try again later"
        })
    }
}

const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await Appointment.find({ userId })
        res.status(200).json({
            success: true,
            appointments
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Please try again later"
        })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await Appointment.findById(appointmentId)

        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            })
        }

        if (appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: 'Appointment is already cancelled'
            })
        }

        if (appointmentData.isCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel a completed appointment'
            })
        }

        if (appointmentData.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized action'
            })
        }

        let refundId = null
        let refundStatus = 'none'
        let refundAmount = 0

        if (appointmentData.payment && appointmentData.paymentId) {
            try {
                const refundResponse = await razorpayInstance.payments.refund(appointmentData.paymentId, {
                    amount: appointmentData.amount * 100,
                    speed: 'normal'
                })
                refundId = refundResponse.id
                refundStatus = 'initiated'
                refundAmount = appointmentData.amount
            } catch (refundError) {
                console.error("Refund failed for paymentId:", appointmentData.paymentId, refundError.message)
                refundStatus = 'failed'
            }
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            cancelled: true,
            refundId,
            refundStatus,
            refundAmount,
            videoCallStatus: 'ended'
        })

        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        if (doctorData && doctorData.slots_booked) {
            let slots_booked = doctorData.slots_booked
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
                await doctorModel.findByIdAndUpdate(docId, { slots_booked })
            }
        }

        const userEmail = appointmentData.userData?.email
        if (userEmail) {
            const docName = typeof appointmentData.docData === 'string'
                ? (appointmentData.docData.match(/name: '([^']+)'/) || [])[1] || 'Doctor'
                : appointmentData.docData?.name || 'Doctor'

            sendCancellationEmail(userEmail, {
                docName,
                slotDate: appointmentData.slotDate,
                slotTime: appointmentData.slotTime
            }).catch(err => console.error("Cancellation email failed:", err))

            if (refundStatus === 'initiated') {
                sendRefundNotification(userEmail, refundAmount, {
                    docName,
                    slotDate: appointmentData.slotDate,
                    slotTime: appointmentData.slotTime
                }).catch(err => console.error("Refund email failed:", err))
            }
        }

        res.json({
            success: true,
            message: refundStatus === 'initiated'
                ? "Appointment Cancelled and Refund Initiated"
                : refundStatus === 'failed'
                    ? "Appointment Cancelled but Refund Failed. Contact support."
                    : "Appointment Cancelled"
        })

    } catch (error) {
        console.error("Cancel error:", error)
        return res.status(500).json({
            success: false,
            message: 'Server Error! Please try again later'
        })
    }
}

export { bookAppointment, listAppointment, cancelAppointment }