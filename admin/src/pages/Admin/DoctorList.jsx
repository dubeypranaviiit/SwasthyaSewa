import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) { 
      getAllDoctors();
    }
  }, [aToken]); 

  return (
    <div className='w-full space-y-4'>
      <h1 className='text-lg sm:text-xl font-bold text-gray-800 uppercase tracking-wide'>All Doctors</h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pt-2'>
        {doctors && doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div 
              className='bg-white border border-indigo-100/70 rounded-2xl overflow-hidden cursor-pointer group shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between' 
              key={index}
            >
              <div className="overflow-hidden bg-indigo-50/50">
                <img 
                  className='w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-all duration-500' 
                  src={item.image} 
                  alt={item.name} 
                />
              </div>

              <div className='p-4 flex flex-col justify-between flex-1 space-y-3'>
                <div>
                  <p className='text-gray-800 text-base font-bold truncate'>{item.name}</p>
                  <p className='text-gray-500 text-xs font-medium mt-0.5'>{item.speciality}</p>
                </div>

                <div className='pt-2 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-700'>
                  <input 
                    onChange={() => changeAvailability(item._id)} 
                    className='w-4 h-4 text-primary accent-primary rounded cursor-pointer' 
                    type="checkbox" 
                    checked={item.available} 
                    id={`avail-${item._id}`}
                  />
                  <label htmlFor={`avail-${item._id}`} className='cursor-pointer select-none'>
                    {item.available ? <span className="text-emerald-600">Available</span> : <span className="text-gray-400">Unavailable</span>}
                  </label>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 text-sm font-medium">
            No doctors registered yet
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorList