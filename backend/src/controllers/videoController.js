import Appointment from "../models/appointment.models.js"
import { streamClient, apiKey } from "../config/streamClient.js"
import { v4 as uuidv4 } from "uuid"
import { sendVideoCallLink } from "../services/emailService.js"

const createVideoCall = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        if (appointment.consultationType !== 'online') {
            return res.status(400).json({
                success: false,
                message: "This is not an online consultation"
            })
        }

        if (appointment.videoCallId) {
            return res.status(200).json({
                success: true,
                videoCallId: appointment.videoCallId,
                videoCallLink: appointment.videoCallLink,
                message: "Video call already created"
            })
        }

        const callId = `swasthya-${uuidv4().slice(0, 12)}`
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
        const videoCallLink = `${frontendUrl}/video-call/${appointmentId}`

        await Appointment.findByIdAndUpdate(appointmentId, {
            videoCallId: callId,
            videoCallLink: videoCallLink
        })

        res.status(200).json({
            success: true,
            videoCallId: callId,
            videoCallLink: videoCallLink,
            message: "Video call created successfully"
        })
    } catch (error) {
        console.error("Create video call error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to create video call"
        })
    }
}

const getVideoToken = async (req, res) => {
    try {
        const userId = req.body.userId || req.query.userId

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            })
        }

        if (!streamClient) {
            return res.status(503).json({
                success: false,
                message: "Video service is not configured. Set STREAM_API_KEY and STREAM_API_SECRET in .env"
            })
        }

        const token = streamClient.createToken(userId)

        res.status(200).json({
            success: true,
            token,
            apiKey: apiKey,
            userId
        })
    } catch (error) {
        console.error("Get video token error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to generate video token"
        })
    }
}

const startVideoCall = async (req, res) => {
    try {
        const { appointmentId, docId } = req.body
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        if (appointment.docId !== docId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only the assigned doctor can start this call"
            })
        }

        if (appointment.consultationType !== 'online') {
            return res.status(400).json({
                success: false,
                message: "This is not an online consultation"
            })
        }

        if (!appointment.payment) {
            return res.status(400).json({
                success: false,
                message: "Cannot start meeting. Payment must be completed successfully first."
            })
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            videoCallStatus: 'active'
        })

        if (appointment.userData && appointment.userData.email) {
            const docName = typeof appointment.docData === 'string'
                ? (appointment.docData.match(/name: '([^']+)'/) || [])[1] || 'Doctor'
                : appointment.docData?.name || 'Doctor'

            await sendVideoCallLink(
                appointment.userData.email,
                appointment.videoCallLink,
                docName,
                appointment.slotTime
            )
        }

        res.status(200).json({
            success: true,
            message: "Video call started. Patient has been notified.",
            videoCallId: appointment.videoCallId,
            videoCallLink: appointment.videoCallLink
        })
    } catch (error) {
        console.error("Start video call error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to start video call"
        })
    }
}

const endVideoCall = async (req, res) => {
    try {
        const { appointmentId, docId } = req.body
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        if (appointment.docId !== docId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            })
        }

        await Appointment.findByIdAndUpdate(appointmentId, {
            videoCallStatus: 'ended',
            isCompleted: true
        })

        res.status(200).json({
            success: true,
            message: "Video call ended and appointment marked as completed"
        })
    } catch (error) {
        console.error("End video call error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to end video call"
        })
    }
}

const getCallDetails = async (req, res) => {
    try {
        const { appointmentId } = req.params
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        res.status(200).json({
            success: true,
            videoCallId: appointment.videoCallId,
            videoCallLink: appointment.videoCallLink,
            videoCallStatus: appointment.videoCallStatus,
            consultationType: appointment.consultationType,
            docData: appointment.docData,
            userData: appointment.userData,
            slotDate: appointment.slotDate,
            slotTime: appointment.slotTime
        })
    } catch (error) {
        console.error("Get call details error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch call details"
        })
    }
}

export { createVideoCall, getVideoToken, startVideoCall, endVideoCall, getCallDetails }
