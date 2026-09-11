import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const About = () => {
  return (
    <div className="py-6 sm:py-10 w-full">
      <div className='text-center text-xl sm:text-2xl text-gray-500 font-medium'>
        <p> ABOUT <span className='text-gray-900 font-bold'>US</span></p>
      </div>

      <div className='my-8 sm:my-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center'>
        <img className="w-full max-w-xs sm:max-w-sm rounded-3xl shadow-md border border-gray-150 object-cover" src={assets.about_image} alt="About SwasthyaSewa" />
        
        <div className='flex flex-col justify-center gap-4 md:w-2/3 text-xs sm:text-sm text-gray-600 leading-relaxed'>
          <p>
            Welcome to <b className="text-gray-900">SwasthyaSewa</b>, your trusted digital healthcare companion.
            We aim to simplify how you connect with doctors, book appointments, and manage your wellness—all in one place.
          </p>
          <p>
            At SwasthyaSewa, we believe healthcare should be simple, smart, and accessible. Whether you're consulting for the first time or tracking long-term care,
            our intuitive platform supports you with efficiency and ease.
          </p>
          <b className='text-gray-900 text-sm sm:text-base mt-2'>Our Vision</b>
          <p>
            Our vision is to empower patients and providers through technology-driven care.
            We strive to build a connected ecosystem where your health is always within reach.
          </p>
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <p className='text-center text-lg sm:text-xl font-extrabold text-gray-900 mb-8 tracking-tight'>
          WHY <span className='text-primary'>CHOOSE US</span>
        </p>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'>
          <div className='border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-3 text-xs sm:text-sm hover:bg-primary text-gray-700 hover:text-white transition-all duration-300 shadow-sm cursor-pointer group'>
            <b className="text-base text-gray-900 group-hover:text-white">Efficiency:</b>
            <p className="leading-relaxed">Instant appointment scheduling tailored to your lifestyle and real-time open slots.</p>
          </div>

          <div className='border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-3 text-xs sm:text-sm hover:bg-primary text-gray-700 hover:text-white transition-all duration-300 shadow-sm cursor-pointer group'>
            <b className="text-base text-gray-900 group-hover:text-white">Convenience:</b>
            <p className="leading-relaxed">Find verified doctors in your area and connect anytime, anywhere via online or offline visits.</p>
          </div>

          <div className='border border-gray-200 rounded-3xl p-6 sm:p-8 flex flex-col gap-3 text-xs sm:text-sm hover:bg-primary text-gray-700 hover:text-white transition-all duration-300 shadow-sm cursor-pointer group'>
            <b className="text-base text-gray-900 group-hover:text-white">Personalization:</b>
            <p className="leading-relaxed">Smart suggestions, vitals logging, and AI symptom assessment tailored to your needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;