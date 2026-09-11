import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets_admin } from '../../assets/assets_admin/assets'

const Dadshboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='w-full space-y-6 sm:space-y-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'> 
        <div className='flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300'>
          <div className='p-3 bg-indigo-50 rounded-xl flex-shrink-0'>
            <img className='w-12 h-12 object-contain' src={assets_admin.doctor_icon} alt="Doctors Icon" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.doctors}</p>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300'>
          <div className='p-3 bg-emerald-50 rounded-xl flex-shrink-0'>
            <img className='w-12 h-12 object-contain' src={assets_admin.appointment_icon} alt="Appointments Icon" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.appointments}</p>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1'>
          <div className='p-3 bg-blue-50 rounded-xl flex-shrink-0'>
            <img className='w-12 h-12 object-contain' src={assets_admin.patients_icon} alt="Patients Icon" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.patients}</p>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5'>Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
          <img className='w-5 h-5' src={assets_admin.list_icon} alt="List Icon" />
          <p className='font-bold text-gray-800 text-sm sm:text-base'>Latest Bookings</p>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.lastestAppointments && dashData.lastestAppointments.length > 0 ? (
            dashData.lastestAppointments.map((item, index) => {
              let docName = "Unknown";
              let docImage = "";

              if (item.docData) {
                const nameMatch = item.docData.match(/name: '([^']+)'/);
                docName = nameMatch ? nameMatch[1] : "Unknown";

                const imageMatch = item.docData.match(/image: '([^']+)'/);
                docImage = imageMatch ? imageMatch[1] : "";
              }

              return (
                <div className='flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-gray-50/80 transition-colors gap-3' key={index}>
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <img className='rounded-full w-10 h-10 object-cover flex-shrink-0 border border-gray-200' src={docImage || assets_admin.doctor_icon} alt={docName} />
                    <div className='min-w-0 flex-1 text-xs sm:text-sm'>
                      <p className='text-gray-800 font-semibold truncate'>{docName}</p>
                      <p className='text-gray-500 text-[11px] sm:text-xs mt-0.5'>{item.slotDate}</p>
                    </div>
                  </div>

                  <div className='flex-shrink-0 flex items-center gap-2'>
                    {item.cancelled ? (
                      <span className="text-red-500 bg-red-50 px-2.5 py-1 rounded-md text-[11px] font-bold border border-red-100">Cancelled</span>
                    ) : (
                      <button 
                        onClick={() => cancelAppointment && cancelAppointment(item._id)}
                        className='p-1.5 hover:bg-red-50 rounded-lg transition-colors'
                        title="Cancel Appointment"
                      >
                        <img className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" src={assets_admin.cancel_icon} alt="Cancel" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">
              No recent bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dadshboard