# SwasthyaSewa — Backend API Engine

The core Node.js & Express serverless API for SwasthyaSewa. It handles database records, user authentication, Razorpay payments, video tokens, and email notifications.

## Features
- **OTP Verification**: Verifies registrations using secure 6-digit OTP codes sent via Gmail SMTP.
- **Video Consultation Gating**: Generates Stream.io video room tokens and restricts access to paid appointments.
- **Transaction Engine**: Connects to Razorpay to verify transactions and initiates automated refunds on cancellation.
- **Earning Calculations**: Computes doctor earnings dynamically while excluding cancelled appointments.
- **Vercel Serverless Ready**: Exports the main app module and eagerly binds database hooks.

## Tech Stack
- Node.js & Express
- MongoDB (Mongoose ODM)
- `getstream` Node SDK
- Razorpay Webhook Integration
- Nodemailer + Gmail SMTP

## Getting Started

### 1. Environment Configuration
Create a `.env` file in the root of the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_EMAIL=your_gmail_address
SMTP_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### 2. Installation & Running
```bash
# Install dependencies
npm install

# Start development server (via nodemon)
npm run dev
```
The server will start listening on port `5000`.