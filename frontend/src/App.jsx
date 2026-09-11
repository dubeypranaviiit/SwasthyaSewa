import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import MyProfile from './pages/MyProfile'
import Login from './pages/Login'
import Contact from './pages/Contact'
import MyAppointement from './pages/MyAppointement'
import MedicalHistory from './pages/MedicalHistory'
import Navbar from './components/Navbar'
import About from './pages/About'
import Appointment from './pages/Appointment'
import OnlineCheckup from './pages/OnlineCheckup'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import CancellationRefundPolicy from './pages/CancellationRefundPolicy'
import ReturnRefundPolicy from './pages/ReturnRefundPolicy'
import VideoCall from './pages/VideoCall'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen flex flex-col justify-between overflow-x-hidden"> 
      <ToastContainer />
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/doctors' element={<Doctors/>} />
          <Route path='/doctors/:speciality' element={<Doctors/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/MyProfile' element={<MyProfile/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/my-appointment' element={<MyAppointement/>} />
          <Route path='/medical-history' element={<MedicalHistory/>} />
          <Route path='/appointment/:docId' element={<Appointment/>} />
          <Route path='/online-checkup' element={<OnlineCheckup/>} />
          <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
          <Route path='/terms-conditions' element={<TermsAndConditions/>} />
          <Route path='/cancellation-refund-policy' element={<CancellationRefundPolicy/>} />
          <Route path='/return-refund-policy' element={<ReturnRefundPolicy/>} />
          <Route path='/video-call/:appointmentId' element={<VideoCall/>} />
        </Routes>
      </main>
      <Footer/>
      <Chatbot />
    </div>
  )
}

export default App