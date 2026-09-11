import dotenv from "dotenv"
dotenv.config();
import razorpay from "razorpay"
import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto"

import Appointment from "../models/appointment.models.js"
const paymentRazorPay = async (req, res) => {

    try {
        const { appointmentId } = req.body
        const appointmentData = await Appointment.findById(appointmentId)
        if (!appointmentData || appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: 'Appointment not found'
            })
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        const order = await razorpayInstance.orders.create(options)

        res.status(200).json({
            success: true,
            message: "Payment Ongoing",
            order
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error! Please try again later'
        })
    }
}

const verifyRazorPay = async (req, res) => {
    try {
        const { responce } = req.body

        const razorpay_order_id = responce?.razorpay_order_id || req.body.razorpay_order_id
        const razorpay_payment_id = responce?.razorpay_payment_id || req.body.razorpay_payment_id
        const razorpay_signature = responce?.razorpay_signature || req.body.razorpay_signature

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment details are missing'
            })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex")

        if (expectedSign === razorpay_signature) {
            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
            const appointmentId = orderInfo.receipt

            await Appointment.findByIdAndUpdate(appointmentId, {
                payment: true,
                paymentId: razorpay_payment_id
            })

            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully'
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed, invalid signature'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error in verifying payment! Please try again later'
        })
    }
}

const checkRefundStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        if (!appointment.refundId) {
            return res.status(200).json({
                success: true,
                refundStatus: appointment.refundStatus || 'none',
                message: appointment.payment ? "No refund has been initiated" : "This appointment was not paid online"
            })
        }

        try {
            const refund = await razorpayInstance.refunds.fetch(appointment.refundId)

            let status = 'initiated'
            if (refund.status === 'processed') {
                status = 'processed'
            } else if (refund.status === 'failed') {
                status = 'failed'
            }

            if (status !== appointment.refundStatus) {
                await Appointment.findByIdAndUpdate(appointmentId, {
                    refundStatus: status
                })
            }

            return res.status(200).json({
                success: true,
                refundStatus: status,
                refundId: appointment.refundId,
                refundAmount: appointment.refundAmount,
                razorpayStatus: refund.status,
                message: status === 'processed'
                    ? "Refund has been processed successfully"
                    : status === 'failed'
                        ? "Refund failed. Please contact support."
                        : "Refund is being processed"
            })
        } catch (razorpayError) {
            console.error("Razorpay refund fetch error:", razorpayError.message)
            return res.status(200).json({
                success: true,
                refundStatus: appointment.refundStatus,
                refundId: appointment.refundId,
                refundAmount: appointment.refundAmount,
                message: "Unable to fetch live status. Last known: " + appointment.refundStatus
            })
        }

    } catch (error) {
        console.error("Check refund status error:", error)
        return res.status(500).json({
            success: false,
            message: "Server Error! Please try again later"
        })
    }
}

export { paymentRazorPay, verifyRazorPay, checkRefundStatus }