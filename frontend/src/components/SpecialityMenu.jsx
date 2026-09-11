import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets.js'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-12 sm:py-16 text-gray-800' id="speciality">
      <h1 className='text-2xl sm:text-3xl font-semibold text-gray-900 text-center tracking-tight'>Find by Speciality</h1>
      <p className='max-w-md text-center text-xs sm:text-sm text-gray-600 leading-relaxed px-4'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
      
      <div className='flex justify-start sm:justify-center gap-4 sm:gap-6 pt-5 w-full overflow-x-auto no-scrollbar px-2 sm:px-0 py-2'>
        {specialityData.map((item, index) => (
          <Link 
            onClick={() => scrollTo(0, 0)} 
            className="flex flex-col items-center text-xs sm:text-sm font-medium cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-300 group p-2 rounded-xl" 
            key={index} 
            to={`/doctors/${item.speciality}`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-50/60 p-3 sm:p-4 mb-2 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <img className="w-full h-full object-contain" src={item.image} alt={item.speciality} />
            </div>
            <p className="text-gray-700 group-hover:text-primary transition-colors text-center text-xs">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu