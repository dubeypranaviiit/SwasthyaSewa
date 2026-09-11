# SwasthyaSewa — Doctor & Admin Dashboard

The administrative panel and doctor workstation interface for SwasthyaSewa, built with Vite and React. It provides tools for clinical staff to manage doctor registrations, list appointments, view checkup triage details, toggle doctor availability, start video calls, process refunds on cancellations, and review monthly earnings graphs.

## Features
- **Responsive Workspace**: Clean side navigation that automatically collapses to a compact icon-only view on mobile and tablet viewports.
- **Doctor Workstation**: Doctors can toggle availability, modify consultation fees, review patients' automated checkup reports, and start/join/end WebRTC video calls.
- **Payment Safeguards**: Restricts doctors from starting video consultations if the payment state is unpaid.
- **Admin Control**: Clinic administrators can add new doctors and review overall appointments.

## Tech Stack
- React 18 & Vite
- Tailwind CSS
- Axios & React Router
- React Toastify

## Getting Started

### 1. Environment Configuration
Create a `.env` file in the root of the `/admin` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### 2. Installation & Running
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will launch on `http://localhost:5174`.
