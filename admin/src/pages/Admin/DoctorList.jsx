import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import DoctorDetailModal from '../../components/DoctorDetailModal'

const DoctorList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } = useContext(AdminContext)
  const [selectedDocId, setSelectedDocId] = useState(null)

  useEffect(() => {
    if (aToken) { 
      getAllDoctors();
    }
  }, [aToken]); 

  return (
    <div className='w-full space-y-4'>
      <div className="flex items-center justify-between">
        <h1 className='text-lg sm:text-xl font-bold text-gray-800 uppercase tracking-wide'>All Doctors</h1>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Registered: {doctors?.length || 0}
        </span>
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pt-2'>
        {doctors && doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div 
              className='bg-white border border-indigo-100/70 rounded-2xl overflow-hidden cursor-pointer group shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between' 
              key={index}
              onClick={() => setSelectedDocId(item._id)}
            >
              <div className="overflow-hidden bg-indigo-50/50 relative">
                <img 
                  className='w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-all duration-500' 
                  src={item.image} 
                  alt={item.name} 
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/90 backdrop-blur-xs border border-gray-200 text-gray-700 shadow-xs">
                  {item.experience || 'Experienced'}
                </span>
              </div>

              <div className='p-4 flex flex-col justify-between flex-1 space-y-3'>
                <div>
                  <p className='text-gray-800 text-base font-bold truncate group-hover:text-primary transition-colors'>{item.name}</p>
                  <p className='text-gray-500 text-xs font-medium mt-0.5'>{item.speciality}</p>
                </div>

                <div className='pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700' onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
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

                  <button
                    onClick={() => setSelectedDocId(item._id)}
                    className="text-[10px] text-primary font-bold hover:underline"
                  >
                    View 360°
                  </button>
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

      {selectedDocId && (
        <DoctorDetailModal
          docId={selectedDocId}
          onClose={() => setSelectedDocId(null)}
          onAvailabilityChange={() => getAllDoctors()}
        />
      )}
    </div>
  )
}

export default DoctorList