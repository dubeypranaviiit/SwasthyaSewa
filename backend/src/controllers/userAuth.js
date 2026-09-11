import userModel from "../models/user.models.js"
import otpModel from "../models/otp.models.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { sendOtpEmail } from "../services/emailService.js"
dotenv.config()

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            })
        }

        await otpModel.deleteMany({ email })

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await otpModel.create({ email, otp })

        const emailSent = await sendOtpEmail(email, otp)
        if (!emailSent) {
            console.log(`\n==================================================`);
            console.log(`[DEVELOPER FALLBACK]`);
            console.log(`OTP Code for ${email} is: ${otp}`);
            console.log(`Copy and paste this code in your browser frontend.`);
            console.log(`Set SMTP_EMAIL & SMTP_PASSWORD in .env to enable Gmail delivery.`);
            console.log(`==================================================\n`);

            return res.status(200).json({
                success: true,
                message: "OTP generated. Check server console for the code (configure SMTP_EMAIL in .env to enable email delivery)."
            })
        }

        res.status(200).json({
            success: true,
            message: "Verification code sent to your email"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        })
    }
}

const verifyOtpAndSignup = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body

        if (!name || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        const otpRecord = await otpModel.findOne({ email, otp })
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            })
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        await otpModel.deleteMany({ email })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.status(200).json({
            success: true,
            token,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        })
    }
}

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        await newUser.save()

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000
            })
            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: "Invalid email or password"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        })
    }
}

export { signUp, login, sendOtp, verifyOtpAndSignup }