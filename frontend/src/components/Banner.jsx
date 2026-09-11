import React, { useContext } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Banner = () => {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
  return (
    <div className='flex flex-col md:flex-row items-center justify-between bg-primary rounded-3xl px-6 sm:px-10 md:px-12 lg:px-16 my-16 sm:my-20 relative overflow-hidden shadow-xl gap-8'>
      <div className='flex-1 py-8 sm:py-12 md:py-16 lg:py-20 z-10 text-center md:text-left'>
        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight'>
          <p>Book Appointment</p>
          <p className='mt-2 sm:mt-4 text-white/95'>With 100+ Trusted Doctors</p>
        </div>
        {token ? (
          <button onClick={()=>{navigate(`/doctors`);scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-primary font-bold px-8 py-3.5 rounded-full mt-6 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg inline-block'>
            Book Appointment
          </button>
        ) : (
          <button onClick={()=>{navigate(`/login`);scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-800 font-bold px-8 py-3.5 rounded-full mt-6 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg inline-block'>
            Create Account
          </button>
        )}
      </div>

      <div className='w-full md:w-1/2 lg:w-5/12 flex justify-center md:justify-end items-end relative min-h-[220px] sm:min-h-[260px] md:min-h-[300px]'>
        <img className='w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain md:absolute md:bottom-0 md:right-0' src={assets.appointment_img} alt="Appointment Guide" />
      </div>
    </div>
  )
}

export default Banner
