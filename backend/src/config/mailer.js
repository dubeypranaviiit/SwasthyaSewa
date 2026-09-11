import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
})

transporter.verify()
    .then(() => console.log("Gmail SMTP connected - emails will be delivered"))
    .catch((err) => console.warn("Gmail SMTP not configured:", err.message))

export default transporter
