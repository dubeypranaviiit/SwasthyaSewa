import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const [relDoc, setRelDoc] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
      if (doctors.length > 0 && speciality) {
        const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
        setRelDoc(doctorsData) 
      }
    }, [doctors, speciality, docId])

  return (
    <div className='flex flex-col items-center gap-4 my-12 sm:my-16 text-gray-900'>
      <h1 className='text-2xl sm:text-3xl font-semibold text-center tracking-tight'>Related Doctors</h1>
      <p className='max-w-md text-center text-xs sm:text-sm text-gray-600 px-4'>Simply browse through our extensive list of trusted doctors.</p>
      
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5 gap-y-8 px-2 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (
          <div 
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
            className='border border-blue-100 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between' 
            key={index}
          >
            <div>
              <div className="relative overflow-hidden bg-blue-50/50">
                <img className="w-full h-48 sm:h-52 object-cover object-top hover:scale-105 transition-all duration-500" src={item.image} alt={item.name} />
                <div className={`absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-xs flex items-center gap-1.5 font-medium ${item.available !== false ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  {item.available !== false ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <div className='p-4'>
                <p className='text-gray-900 text-base sm:text-lg font-bold tracking-tight'>{item.name}</p>
                <p className='text-gray-500 text-xs sm:text-sm mt-0.5'>{item.speciality}</p>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <button className="w-full text-xs font-semibold py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => { navigate(`/doctors`); scrollTo(0, 0) }} className='bg-primary text-white font-semibold text-sm px-10 py-3 rounded-full mt-8 hover:bg-opacity-95 shadow-md active:scale-95 transition-all'>
        View All Doctors
      </button>
    </div>
  )
}

export default RelatedDoctors