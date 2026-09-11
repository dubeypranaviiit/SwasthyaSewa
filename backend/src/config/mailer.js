import nodemailer from "nodemailer"
import dns from "node:dns"
import dotenv from "dotenv"
dotenv.config()

// Render only supports IPv4 outbound; prevent ENETUNREACH on IPv6 addresses
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first")
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4, // Force IPv4
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
})

transporter.verify()
    .then(() => console.log("Gmail SMTP connected (IPv4) - emails will be delivered"))
    .catch((err) => console.warn("Gmail SMTP not configured:", err.message))

export default transporter
