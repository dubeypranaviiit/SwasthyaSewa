import nodemailer from "nodemailer"
import dns from "node:dns"
import dotenv from "dotenv"
dotenv.config()

if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first")
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
})

transporter.verify()
    .then(() => console.log("Gmail SMTP connected (IPv4) - emails will be delivered"))
    .catch((err) => console.warn("Gmail SMTP not configured:", err.message))

export default transporter
