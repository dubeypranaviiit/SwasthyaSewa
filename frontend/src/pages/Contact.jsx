import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

function Contact() {
  return (
    <div className="py-6 sm:py-10 w-full">
      <div className='text-center text-xl sm:text-2xl text-gray-500 font-medium'>
        <p> CONTACT <span className='text-gray-900 font-bold'>US</span></p>
      </div>

      <div className='my-8 sm:my-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center mb-20 text-xs sm:text-sm'>
        <img className="w-full max-w-xs sm:max-w-sm rounded-3xl shadow-md border border-gray-150 object-cover" src={assets.contact_image} alt="Contact SwasthyaSewa" />

        <div className='flex flex-col justify-center items-start gap-4 md:w-1/2 text-gray-600 leading-relaxed'>
          
          <p className='font-bold text-base sm:text-lg text-gray-900'>Our Office</p>
          <p className='text-gray-600'>
            1st Floor, NH-21, Booty More, Ranchi <br />
            Jharkhand 835217, India
          </p>

          <p className='text-gray-600'>
            Tel: +91 8092599674 <br />
            Email: support@swasthyasewa.com
          </p>

          <p className='font-bold text-base sm:text-lg text-gray-900 mt-2'>Careers at SwasthyaSewa</p>
          <p className='text-gray-600'>
            Join our growing healthcare technology team and help shape the future of digital healthcare.
          </p>

          <button className='border border-gray-900 text-gray-900 font-bold px-8 py-3.5 rounded-full text-xs sm:text-sm hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm mt-2'>
            Explore Careers
          </button>

        </div>
      </div>
    </div>
  )
}

export default Contact