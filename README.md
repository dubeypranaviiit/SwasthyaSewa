# SwasthyaSewa — Smart Healthcare & Teleconsultation Platform

SwasthyaSewa (formerly VitaCare) is a complete clinic management and teleconsultation suite. It includes a patient-facing portal, an administrative/doctor workstation console, and a serverless Express backend API supporting digital health cards, Razorpay payments, Gmail SMTP reminders, and Stream.io video consultations.

---

## 1. Project Directory Structure

The project is structured as a monorepo containing three core components:

*   **`backend/`**: Node.js & Express API engine managing Mongoose schemas, token authorizations, emails, checkout validations, and automated cancellation refunds.
*   **`frontend/`**: Patient portal (Vite + React) allowing users to schedule visits (online/offline), view digital health cards, and join consultations.
*   **`admin/`**: Doctor & Admin workstation dashboard (Vite + React) for managing appointments, toggling doctor availability, viewing patient triage reports, starting calls, and tracking doctor earnings.

---

## 2. Installation & Quick Start

Follow these steps to run the complete environment locally:

### Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed.

### Step 1: Configure Environment Variables
You must set up `.env` files in each sub-directory using the templates provided in their respective folders.

### Step 2: Running the Applications
Open three separate terminal windows and execute:

```bash
# 1. Run the Backend API (Starts on port 5000)
cd backend
npm install
npm run dev

# 2. Run the Patient Portal (Starts on port 5173)
cd ../frontend
npm install
npm run dev

# 3. Run the Admin/Doctor Console (Starts on port 5174)
cd ../admin
npm install
npm run dev
```

---

## 3. Key Core Features & Safeguards

-   **Payment-Protected Video Consultations**: Doctors cannot start video consultation calls unless the appointment payment is verified. Unpaid appointments show a disabled "Payment Pending" button.
-   **Completed Session Security**: Completed appointments cannot be cancelled on the patient dashboard or through backend API endpoints. Once completed, all options (Cancel, Join, Pay) are replaced by a "Completed" badge.
-   **Dynamic Earnings Adjustment**: Cancelled appointments are automatically excluded from the doctor's total earnings dynamically.
-   **Responsive Layouts**: The doctor/admin console features a fully responsive sidebar that collapses to a compact icon-only view on mobile.
-   **Gmail SMTP OTP Verification**: Patient account creation uses standard Gmail SMTP to deliver verification codes securely to any email address.
-   **Digital Health Card & BMI**: The patient profile features a mock QR-coded digital health ID card with real-time BMI calculations.

---

## 4. Vercel Deployment

Each directory is pre-configured with `vercel.json` and code exports to allow direct deployment to Vercel as three independent projects:
-   **Backend**: Exports the Express `app` module and connects eagerly to MongoDB & Cloudinary to run inside Vercel Node.js Serverless Functions.
-   **Frontend & Admin**: Configured with single-page application (SPA) rewrite rules in `vercel.json` to prevent route refreshes from resulting in 404 errors.
