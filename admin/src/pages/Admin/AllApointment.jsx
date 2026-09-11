import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets_admin } from '../../assets/assets_admin/assets'

const AllApointment = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge } = useContext(AppContext)
  const [activeReport, setActiveReport] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full space-y-4'>
      <h1 className='text-lg sm:text-xl font-bold text-gray-800'>All Appointments</h1>

      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className='block sm:hidden divide-y divide-gray-100'>
          {appointments && appointments.length > 0 ? (
            appointments.map((item, index) => {
              let docName = "Unknown";
              let docImage = "";

              if (item.docData) {
                const nameMatch = item.docData.match(/name: '([^']+)'/);
                docName = nameMatch ? nameMatch[1] : "Unknown";

                const imageMatch = item.docData.match(/image: '([^']+)'/);
                docImage = imageMatch ? imageMatch[1] : "";
              }
              const userAge = calculateAge(item.userData?.dob)

              return (
                <div key={index} className='p-4 space-y-3 hover:bg-gray-50/50 transition-colors'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold text-gray-400'>#{index + 1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      item.consultationType === 'online'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-indigo-50 text-primary border-indigo-100'
                    }`}>
                      {item.consultationType || 'offline'}
                    </span>
                  </div>

                  <div className='flex items-center gap-3'>
                    <img className='w-12 h-12 rounded-xl object-cover border border-gray-100' src={item.userData?.image} alt={item.userData?.name} />
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-gray-800 text-sm truncate'>{item.userData?.name}</p>
                      <p className='text-xs text-gray-500'>Age: {userAge} yrs</p>
                      {item.checkupReport && (
                        <button 
                          onClick={() => setActiveReport({ ...item.checkupReport, patientName: item.userData?.name })}
                          className='text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md font-bold mt-1 hover:bg-emerald-100 transition'
                        >
                          Checkup Report
                        </button>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-2 text-xs bg-gray-50/70 p-2.5 rounded-xl border border-gray-100'>
                    <div>
                      <p className='text-gray-400 font-medium text-[10px] uppercase'>Date & Time</p>
                      <p className='font-semibold text-gray-700 mt-0.5'>{item.slotDate}</p>
                      <p className='text-gray-500 text-[11px]'>{item.slotTime}</p>
                    </div>
                    <div>
                      <p className='text-gray-400 font-medium text-[10px] uppercase'>Doctor</p>
                      <div className='flex items-center gap-1.5 mt-0.5'>
                        <img className='w-5 h-5 rounded-full object-cover bg-gray-200' src={docImage} alt={docName} />
                        <p className='font-semibold text-gray-700 truncate text-xs'>{docName}</p>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between pt-1'>
                    <span className='text-sm font-bold text-gray-800'>{item.currency || '$'}{item.amount}</span>
                    {item.cancelled ? (
                      <div className="flex flex-col items-end">
                        <span className='text-red-500 font-bold text-xs bg-red-50 px-2 py-0.5 rounded border border-red-100'>Cancelled</span>
                        {item.refundStatus && item.refundStatus !== 'none' && (
                          <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-primary font-bold px-1.5 py-0.5 rounded uppercase mt-0.5">
                            Refund: {item.refundStatus}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => cancelAppointment && cancelAppointment(item._id)}
                        className='flex items-center gap-1 text-xs text-red-500 font-semibold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition'
                      >
                        <img src={assets_admin.cancel_icon} className="w-4 h-4" alt="Cancel" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">No appointments found</div>
          )}
        </div>

        <div className='hidden sm:block overflow-x-auto min-h-[50vh] max-h-[75vh] overflow-y-auto'>
          <div className='min-w-[750px]'>
            <div className='grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] gap-2 py-3.5 px-6 border-b bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs'>
              <p>#</p>
              <p>Patient</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Doctor</p>
              <p>Fees</p>
              <p className="text-right">Action</p>
            </div>

            <div className='divide-y divide-gray-100 text-xs sm:text-sm text-gray-700'>
              {appointments && appointments.length > 0 ? (
                appointments.map((item, index) => { 
                  let docName = "Unknown";
                  let docImage = "";

                  if (item.docData) {
                    const nameMatch = item.docData.match(/name: '([^']+)'/);
                    docName = nameMatch ? nameMatch[1] : "Unknown";

                    const imageMatch = item.docData.match(/image: '([^']+)'/);
                    docImage = imageMatch ? imageMatch[1] : "";
                  }
                  const userAge = calculateAge(item.userData?.dob)

                  return (
                    <div className='grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] gap-2 items-center py-3.5 px-6 hover:bg-gray-50/70 transition-colors' key={index}>
                      <p className='font-bold text-gray-400'>{index + 1}</p>
                      
                      <div className='flex items-center gap-3 min-w-0'> 
                        <img className='w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0' src={item.userData?.image} alt={item.userData?.name} />
                        <div className='flex flex-col items-start min-w-0'>
                          <p className="font-bold text-gray-800 truncate">{item.userData?.name}</p>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider mt-0.5 border ${
                            item.consultationType === 'online'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-indigo-50 text-primary border-indigo-100'
                          }`}>
                            {item.consultationType || 'offline'}
                          </span>
                          {item.checkupReport && (
                            <button 
                              onClick={() => setActiveReport({ ...item.checkupReport, patientName: item.userData?.name })}
                              className='text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-md font-bold mt-1 hover:bg-emerald-100 transition truncate'
                            >
                              Checkup Report
                            </button>
                          )}
                        </div>
                      </div>

                      <p className='font-medium text-gray-600'>{userAge}</p>
                      
                      <div>
                        <p className='font-semibold text-gray-800'>{item.slotDate}</p>
                        <p className='text-gray-400 text-xs mt-0.5'>{item.slotTime}</p>
                      </div>

                      <div className='flex items-center gap-2 min-w-0'> 
                        <img className='w-7 h-7 rounded-full object-cover bg-gray-200 flex-shrink-0' src={docImage} alt={docName} />
                        <p className='font-medium text-gray-700 truncate'>{docName}</p>
                      </div>

                      <p className='font-bold text-gray-800'>{item.currency || '$'}{item.amount}</p>

                      <div className="flex justify-end">
                        {item.cancelled ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className='text-red-500 font-bold text-xs bg-red-50 px-2 py-0.5 rounded border border-red-100'>Cancelled</span>
                            {item.refundStatus && item.refundStatus !== 'none' && (
                              <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-primary font-bold px-1 py-0.5 rounded uppercase">
                                {item.refundStatus}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button 
                            onClick={() => cancelAppointment && cancelAppointment(item._id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <img src={assets_admin.cancel_icon} className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" alt="Cancel" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">No appointments found</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 border-b pb-3 mb-4 pr-6">Patient Checkup Report</h3>
            <button 
              onClick={() => setActiveReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Patient Name</p>
                <p className="text-base font-semibold text-gray-800">{activeReport.patientName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Severity</p>
                  <p className={`text-sm font-bold mt-0.5 ${
                    activeReport.severity === 'High' ? 'text-red-500' :
                    activeReport.severity === 'Medium' ? 'text-yellow-500' :
                    'text-emerald-500'
                  }`}>{activeReport.severity} Risk</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Duration</p>
                  <p className="text-sm text-gray-800 mt-0.5">{activeReport.duration || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Symptoms</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {activeReport.symptoms?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-primary text-xs font-semibold rounded-full">{s}</span>
                  )) || 'None'}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Recorded Vitals</p>
                <div className="grid grid-cols-3 gap-2 bg-gray-50 border rounded-xl p-3 text-center text-xs mt-1.5">
                  <div>
                    <p className="text-gray-400">Temp</p>
                    <p className="font-semibold text-gray-700 text-sm mt-0.5">{activeReport.temperature || 'N/A'}°F</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Heart Rate</p>
                    <p className="font-semibold text-gray-700 text-sm mt-0.5">{activeReport.heartRate || 'N/A'} bpm</p>
                  </div>
                  <div>
                    <p className="text-gray-400">BP</p>
                    <p className="font-semibold text-gray-700 text-sm mt-0.5">{activeReport.bloodPressure || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Suggested Advice</p>
                <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border mt-1 leading-relaxed">{activeReport.advice}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveReport(null)}
                className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-[#4d5cf5] transition text-sm shadow-sm"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllApointment