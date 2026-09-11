# SwasthyaSewa — Smart Healthcare & Teleconsultation Platform

SwasthyaSewa is a full-stack clinical management and teleconsultation platform designed to streamline doctor-patient interactions. It features a patient portal, a doctor/admin management workstation, and a scalable Express backend supporting real-time WebRTC video consultations, AI-powered health checkups, Redis distributed slot-locking, Razorpay checkout with cancellation refunds, and background email queues.

---

## 🏗️ Architecture & Project Structure

The repository is structured as a monorepo containing three core applications:

```
SwasthyaSewa/
├── backend/        # Express.js REST API & micro-services
├── frontend/       # Patient-facing portal (React + Vite + Tailwind CSS)
├── admin/          # Doctor & Admin workstation console (React + Vite + Tailwind CSS)
└── README.md       # Root project documentation
```

### Module Breakdown
*   **`backend/`**: Node.js & Express API with MongoDB (Mongoose), Redis distributed slot locking, BullMQ async mail worker, Cloudinary image uploads, JWT auth, and Stream.io WebRTC tokens.
*   **`frontend/`**: Patient portal for discovering doctors, booking appointments (in-clinic or discounted online teleconsultations), AI health checkup & report analysis, digital health cards, and joining live video calls.
*   **`admin/`**: Clinical dashboard for administrators (adding doctors, reviewing platform bookings) and doctors (managing availability, viewing patient triage history, creating prescriptions, launching video sessions, and tracking earnings).

---

## ✨ Key Features

### 🩺 Patient Experience
- **Doctor Discovery & Filtering**: Search and filter specialists across disciplines (General Physician, Gynecologist, Dermatologist, Pediatrician, Neurologist, Gastroenterologist).
- **Flexible Appointment Booking**: Choose between in-clinic visits and online teleconsultations (with an automated 20% discount applied to virtual sessions).
- **Concurrency & Slot Locking**: Redis-backed distributed slot holds prevent double-booking during checkout.
- **AI Health Check & Online Triage**: AI symptom analysis, medical report processing, triage risk flags, and recommended doctor specialties.
- **WebRTC Video Consultations**: In-browser video rooms powered by Stream.io Video SDK with microphone/camera controls and live status.
- **Digital Health Card & BMI**: Profile page with personal health ID, vitals tracking, and real-time BMI calculator.
- **Prescription & Medical History**: Downloadable PDF prescriptions and chronological appointment logs.
- **Secure Payments & Refunds**: Razorpay integration with instant verification and automated refund status tracking upon cancellation.

### 👨‍⚕️ Doctor & Admin Workstation
- **Doctor Console**: Toggle availability, adjust consultation fees, inspect patient medical checkup history, and launch video calls once payment is verified.
- **Prescription Builder**: Modal interface for doctors to draft and save clinical notes and prescriptions directly to patient records.
- **Dynamic Earnings Tracking**: Real-time revenue analytics that automatically exclude cancelled appointments.
- **Admin Management**: Onboard new doctors with Cloudinary avatar uploads and audit platform-wide bookings.
- **Responsive Layout**: Mobile-first collapsible navigation drawer tailored for tablet and mobile devices.

### 🛡️ Backend & System Reliability
- **Multi-Tier Rate Limiting**: Redis/in-memory rate limiters protecting authentication, OTP generation, booking, and payment routes.
- **Resilient Email Queue**: Asynchronous OTP delivery via BullMQ with multi-provider failover (Brevo API, Resend, and Nodemailer Gmail SMTP).
- **Security Hardening**: Protected with Helmet headers, JWT role validation (`User`, `Doctor`, `Admin`), and input sanitization.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Redis (`ioredis`), BullMQ, JWT, Multer, Helmet |
| **Frontend** | React 18, Vite, Tailwind CSS, `@stream-io/video-react-sdk`, Lucide Icons, Axios, React Router |
| **Admin Portal** | React 18, Vite, Tailwind CSS, Axios, React Router, React Toastify |
| **Third-Party Services** | Razorpay (Payments), Stream.io (WebRTC Video), Cloudinary (Media Storage), Brevo / Resend / Gmail SMTP (Email) |

---

## ⚙️ Environment Variables Setup

### 1. `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/swasthyasewa
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@swasthyasewa.com
ADMIN_PASSWORD=your_admin_password
CURRENCY=INR
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stream.io Video SDK
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Redis (Optional: Falls back to memory cache/locks if not set)
REDIS_URL=redis://default:<password>@<host>:<port>

# Email Services (Brevo / Resend / Gmail SMTP)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender@domain.com
RESEND_API_KEY=your_resend_api_key
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

### 2. `frontend/.env`
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_STREAM_API_KEY=your_stream_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_USE_MOCK_AI=true
```

### 3. `admin/.env`
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas)
- [Redis](https://redis.io/) (optional, in-memory fallback included)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/dubeypranaviiit/Doctor-Appointment.git
cd SwasthyaSewa

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install admin dependencies
cd ../admin && npm install
```

### Step 2: Run Development Servers

Open three terminal windows or tabs:

```bash
# Terminal 1: Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Patient Portal (Port 5173)
cd frontend
npm run dev

# Terminal 3: Doctor & Admin Console (Port 5174)
cd admin
npm run dev
```

---

## 📡 API Overview

| Route Prefix | Access | Description |
|---|---|---|
| `POST /api/user/send-otp` | Public | Generate and send registration OTP via email |
| `POST /api/user/verify-otp-signup` | Public | Verify OTP and register patient account |
| `POST /api/user/login` | Public | Patient login & JWT issuance |
| `POST /api/user/hold-slot` | User | Temporarily lock an appointment slot during booking |
| `POST /api/user/book-appointment` | User | Confirm appointment booking |
| `POST /api/user/payment-razorpay` | User | Create Razorpay payment order |
| `POST /api/user/verify-razorpay` | User | Verify Razorpay payment signature |
| `POST /api/video/create-call` | User | Initialize Stream.io WebRTC call session |
| `GET /api/video/token` | User / Doctor | Generate WebRTC user token for video room |
| `POST /api/doctor/login` | Public | Doctor authentication |
| `GET /api/doctor/dashboard` | Doctor | Retrieve doctor stats, earnings, and appointments |
| `POST /api/doctor/save-prescription` | Doctor | Save clinical prescription for an appointment |
| `POST /api/admin/login` | Admin | Administrative login |
| `POST /api/admin/add-doctor` | Admin | Register new doctor with profile photo |
| `GET /api/admin/dashboard` | Admin | Platform-wide analytics and booking logs |

---

## ☁️ Deployment

Each application includes pre-configured `vercel.json` files for zero-config deployment on [Vercel](https://vercel.com/):
- **`backend/`**: Deployed as a serverless Node.js Express API.
- **`frontend/`** & **`admin/`**: Deployed as Single Page Applications (SPAs) with catch-all routing rules.
