import transporter from "../config/mailer.js";
import { Resend } from "resend";
import dotenv from "dotenv";
import { enqueueEmailJob, setDirectEmailDispatcher } from "../queues/emailQueue.js";
dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.SMTP_EMAIL || "noreply@swasthyasewa.com";
const fromName = "SwasthyaSewa";

const sendMailDirect = async (to, subject, html, contextName) => {
    if (process.env.BREVO_API_KEY) {
        try {
            const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_EMAIL || "abpa4402@gmail.com";
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sender: { name: fromName, email: senderEmail },
                    to: [{ email: to }],
                    subject: subject,
                    htmlContent: html,
                }),
            });

            const resData = await response.json();
            if (response.ok && resData.messageId) {
                console.log(`[Brevo API] Email sent (${contextName}): ${resData.messageId} -> ${to}`);
                return true;
            } else {
                console.warn(`[Brevo API] Failed (${contextName}):`, resData?.message || resData);
            }
        } catch (brevoErr) {
            console.warn(`[Brevo API] Error:`, brevoErr.message);
        }
    }

    if (resend) {
        try {
            const sender = process.env.RESEND_FROM_EMAIL || "SwasthyaSewa <onboarding@resend.dev>";
            const { data, error } = await resend.emails.send({
                from: sender,
                to: [to],
                subject,
                html,
            });

            if (!error && data?.id) {
                console.log(`[Resend] Email sent (${contextName}): ${data.id} -> ${to}`);
                return true;
            } else if (error) {
                console.warn(`[Resend] Failed (${contextName}): ${error.message}`);
            }
        } catch (resendErr) {
            console.warn(`[Resend] Error: ${resendErr.message}`);
        }
    }

    try {
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.warn(`SMTP not configured. Skipping "${contextName}" email to ${to}`);
            return false;
        }

        const info = await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log(`[SMTP] Email sent (${contextName}): ${info.messageId} -> ${to}`);
        return true;
    } catch (error) {
        console.error(`[SMTP] Email failed (${contextName}) to ${to}:`, error.message);
        return false;
    }
};

const directEmailDispatcher = async (type, payload) => {
    switch (type) {
        case "otp-email": {
            const { email, otp } = payload;
            const html = `
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 24px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">SwasthyaSewa</h1>
                        <p style="color:#c7d2fe;margin:8px 0 0;font-size:14px;">Secure Email Verification</p>
                    </div>
                    <div style="padding:32px 24px;text-align:center;">
                        <p style="color:#374151;font-size:16px;margin:0 0 8px;">Your one-time verification code is:</p>
                        <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin:20px 0;">
                            <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#4f46e5;">${otp}</span>
                        </div>
                        <p style="color:#6b7280;font-size:13px;margin:0;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    </div>
                    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                        <p style="color:#9ca3af;font-size:11px;margin:0;">If you didn't request this code, please ignore this email.</p>
                    </div>
                </div>
            `;
            return await sendMailDirect(email, "Your SwasthyaSewa Verification Code", html, "OTP email");
        }

        case "booking-confirmation": {
            const { email, appointmentData } = payload;
            const isOnline = appointmentData.consultationType === "online";
            const locationBlock = isOnline
                ? `<div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:12px;padding:16px;margin:16px 0;">
                        <p style="color:#4f46e5;font-weight:700;margin:0 0 8px;font-size:14px;">Online Video Consultation</p>
                        <p style="color:#374151;font-size:13px;margin:0;">A video call link will be shared with you before your appointment. The doctor will start the session at the scheduled time.</p>
                        ${appointmentData.videoCallLink ? `<a href="${appointmentData.videoCallLink}" style="display:inline-block;margin-top:12px;background:#4f46e5;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Join Video Call</a>` : ""}
                   </div>`
                : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:16px 0;">
                        <p style="color:#16a34a;font-weight:700;margin:0 0 8px;font-size:14px;">In-Person Visit</p>
                        <p style="color:#374151;font-size:13px;margin:0;">Please visit the clinic at the scheduled time. Carry a valid ID and any previous medical records.</p>
                   </div>`;

            const html = `
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:28px 24px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:22px;">Appointment Confirmed</h1>
                    </div>
                    <div style="padding:24px;">
                        <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:16px;">
                            <table style="width:100%;font-size:13px;color:#374151;">
                                <tr><td style="padding:6px 0;color:#6b7280;">Doctor</td><td style="padding:6px 0;font-weight:600;">Dr. ${appointmentData.docName || "N/A"}</td></tr>
                                <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;font-weight:600;">${appointmentData.slotDate}</td></tr>
                                <tr><td style="padding:6px 0;color:#6b7280;">Time</td><td style="padding:6px 0;font-weight:600;">${appointmentData.slotTime}</td></tr>
                                <tr><td style="padding:6px 0;color:#6b7280;">Type</td><td style="padding:6px 0;font-weight:600;">${isOnline ? "Online" : "Offline"}</td></tr>
                                <tr><td style="padding:6px 0;color:#6b7280;">Fee</td><td style="padding:6px 0;font-weight:600;">₹${appointmentData.amount}</td></tr>
                            </table>
                        </div>
                        ${locationBlock}
                    </div>
                    <div style="background:#f9fafb;padding:14px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                        <p style="color:#9ca3af;font-size:11px;margin:0;">SwasthyaSewa — Your Health, Our Priority</p>
                    </div>
                </div>
            `;
            return await sendMailDirect(
                email,
                `Booking Confirmed — Dr. ${appointmentData.docName || "Doctor"} on ${appointmentData.slotDate}`,
                html,
                "Booking confirmation"
            );
        }

        case "video-call-link": {
            const { email, callLink, doctorName, slotTime } = payload;
            const html = `
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:28px 24px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:22px;">Video Call Ready</h1>
                    </div>
                    <div style="padding:32px 24px;text-align:center;">
                        <p style="color:#374151;font-size:15px;margin:0 0 8px;">Dr. <strong>${doctorName}</strong> has started your consultation.</p>
                        <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">Scheduled at: ${slotTime}</p>
                        <a href="${callLink}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">Join Video Call Now</a>
                        <p style="color:#9ca3af;font-size:12px;margin:20px 0 0;">Make sure your camera and microphone are enabled.</p>
                    </div>
                </div>
            `;
            return await sendMailDirect(email, `Your Video Call with Dr. ${doctorName} is Ready`, html, "Video call link");
        }

        case "refund-notification": {
            const { email, amount, appointmentData } = payload;
            const html = `
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="background:linear-gradient(135deg,#ef4444,#dc2626);padding:28px 24px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:22px;">Refund Initiated</h1>
                    </div>
                    <div style="padding:24px;text-align:center;">
                        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin:16px 0;">
                            <p style="color:#dc2626;font-size:28px;font-weight:800;margin:0;">₹${amount}</p>
                            <p style="color:#6b7280;font-size:13px;margin:8px 0 0;">Refund will be credited within 5-7 business days.</p>
                        </div>
                        <div style="background:#f9fafb;border-radius:12px;padding:16px;text-align:left;font-size:13px;color:#374151;">
                            <p style="margin:4px 0;"><strong>Doctor:</strong> Dr. ${appointmentData.docName || "N/A"}</p>
                            <p style="margin:4px 0;"><strong>Date:</strong> ${appointmentData.slotDate}</p>
                            <p style="margin:4px 0;"><strong>Time:</strong> ${appointmentData.slotTime}</p>
                        </div>
                    </div>
                </div>
            `;
            return await sendMailDirect(email, `Refund of ₹${amount} Initiated — SwasthyaSewa`, html, "Refund notification");
        }

        case "cancellation-email": {
            const { email, appointmentData } = payload;
            const html = `
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="background:#374151;padding:28px 24px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:22px;">Appointment Cancelled</h1>
                    </div>
                    <div style="padding:24px;">
                        <div style="background:#f9fafb;border-radius:12px;padding:16px;font-size:13px;color:#374151;">
                            <p style="margin:4px 0;"><strong>Doctor:</strong> Dr. ${appointmentData.docName || "N/A"}</p>
                            <p style="margin:4px 0;"><strong>Date:</strong> ${appointmentData.slotDate}</p>
                            <p style="margin:4px 0;"><strong>Time:</strong> ${appointmentData.slotTime}</p>
                        </div>
                        <p style="color:#6b7280;font-size:13px;text-align:center;margin:16px 0 0;">If you paid online, a refund has been initiated and will reflect in 5-7 business days.</p>
                    </div>
                </div>
            `;
            return await sendMailDirect(email, `Appointment Cancelled — SwasthyaSewa`, html, "Cancellation email");
        }

        default:
            console.warn(`[EmailService] Unrecognized email job type: ${type}`);
            return false;
    }
};

setDirectEmailDispatcher(directEmailDispatcher);

export const sendOtpEmail = async (email, otp) => {
    return await enqueueEmailJob("otp-email", { email, otp });
};

export const sendBookingConfirmation = async (email, appointmentData) => {
    return await enqueueEmailJob("booking-confirmation", { email, appointmentData });
};

export const sendVideoCallLink = async (email, callLink, doctorName, slotTime) => {
    return await enqueueEmailJob("video-call-link", { email, callLink, doctorName, slotTime });
};

export const sendRefundNotification = async (email, amount, appointmentData) => {
    return await enqueueEmailJob("refund-notification", { email, amount, appointmentData });
};

export const sendCancellationEmail = async (email, appointmentData) => {
    return await enqueueEmailJob("cancellation-email", { email, appointmentData });
};

export { sendMailDirect };
