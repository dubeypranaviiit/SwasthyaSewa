# SwasthyaSewa — Patient Portal (Frontend)

The patient-facing portal for SwasthyaSewa, built with Vite and React. It allows users to browse doctors, book offline clinic visits or discounted online teleconsultations, manage digital health cards, and join WebRTC video consultations in real-time.

## Features
- **Online vs Offline Booking**: Toggle appointments with a 20% discount applied to online consultations.
- **WebRTC Video consultations**: Fully integrated Stream.io WebRTC call room with automated video link notifications.
- **Digital Health ID Card**: A premium user profile dashboard featuring a mock health card, vitals tracker, and BMI calculator.
- **Secure Authentication**: OTP validation during user registration.

## Tech Stack
- React 18 & Vite
- Tailwind CSS & Lucide Icons
- `@stream-io/video-react-sdk` & `@stream-io/video-client`
- Axios
- Razorpay Web Checkout

## Getting Started

### 1. Environment Configuration
Create a `.env` file in the root of the `/frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_STREAM_API_KEY=your_stream_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Installation & Running
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will launch on `http://localhost:5173`.
