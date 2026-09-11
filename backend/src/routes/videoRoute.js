import express from "express"
import jwt from "jsonwebtoken"
import { authUser } from "../middleware/authUser.js"
import { authDoctor } from "../middleware/authDoctor.js"
import { createVideoCall, getVideoToken, startVideoCall, endVideoCall, getCallDetails } from "../controllers/videoController.js"
import upload from "../middleware/multer.js"

const videoRouter = express.Router()

const authVideoUserOrDoctor = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.dtoken
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized token"
        })
    }
}

videoRouter.post('/create-call', upload.none(), authUser, createVideoCall)
videoRouter.get('/token', upload.none(), authVideoUserOrDoctor, getVideoToken)
videoRouter.post('/start-call', upload.none(), authDoctor, startVideoCall)
videoRouter.post('/end-call', upload.none(), authDoctor, endVideoCall)
videoRouter.get('/call-details/:appointmentId', upload.none(), authVideoUserOrDoctor, getCallDetails)

export default videoRouter
