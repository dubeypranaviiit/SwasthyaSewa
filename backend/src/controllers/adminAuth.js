import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator"
import dotenv from "dotenv"
dotenv.config();

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all data carefully",
            })
        }
        let secret = process.env.JWT_SECRET
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, secret);
            res.status(200).json({
                success: true,
                token
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password or Email",
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Please Enter a strong password",
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating admin api in admin controller",
            error: error.message
        });
    }
}

export { adminLogin }