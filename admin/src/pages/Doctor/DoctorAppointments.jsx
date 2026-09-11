import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets_admin } from '../../assets/assets_admin/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, appointmentCancel, appointmentComplete, backendUrl } = useContext(DoctorContext)
  const { calculateAge, currency } = useContext(AppContext)
  const [activeReport, setActiveReport] = useState(null)

  const startVideoCall = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/video/start-call`, { appointmentId }, { headers: { dToken } })
      if (data.success) {
        toast.success("Video call started successfully!")
        getAppointments()
        window.open(`http://localhost:5173/video-call/${appointmentId}?dToken=${dToken}`, '_blank')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const endVideoCall = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/video/end-call`, { appointmentId }, { headers: { dToken } })
      if (data.success) {
        toast.success("Video call ended.")
        getAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full space-y-4'>
      <h1 className='text-lg sm:text-xl font-bold text-gray-800'>All Appointments</h1>

      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className='block sm:hidden divide-y divide-gray-100'>
          {appointments && appointments.length > 0 ? (
            [...appointments].reverse().map((item, index) => (
              <div key={index} className='p-4 space-y-3 hover:bg-gray-50/50 transition-colors'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-gray-400'>#{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      item.consultationType === 'online'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-indigo-50 text-primary border-indigo-100'
                    }`}>
                      {item.consultationType || 'offline'}
                    </span>
                    <span className='text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-gray-200 text-gray-600 bg-gray-50'>
                      {item.payment ? 'Online' : 'Cash'}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <img className='w-12 h-12 rounded-xl object-cover border border-gray-100' src={item.userData?.image} alt={item.userData?.name} />
                  <div className='flex-1 min-w-0'>
                    <p className='font-bold text-gray-800 text-sm truncate'>{item.userData?.name}</p>
                    <p className='text-xs text-gray-500'>Age: {calculateAge(item.userData?.dob)} yrs</p>
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

                <div className='flex items-center justify-between text-xs bg-gray-50/70 p-2.5 rounded-xl border border-gray-100'>
                  <div>
                    <p className='text-gray-400 font-medium text-[10px] uppercase'>Slot</p>
                    <p className='font-semibold text-gray-700 mt-0.5'>{item.slotDate}, {item.slotTime}</p>
                  </div>
                  <div className="text-right">
                    <p className='text-gray-400 font-medium text-[10px] uppercase'>Fees</p>
                    <p className='font-bold text-gray-800 text-sm mt-0.5'>{currency || '$'}{item.amount}</p>
                  </div>
                </div>

                <div className='flex items-center justify-between pt-1'>
                  {item.cancelled ? (
                    <span className="text-red-500 font-bold text-xs bg-red-50 px-2.5 py-1 rounded border border-red-100">Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">Completed</span>
                  ) : (
                    <div className='flex items-center justify-between w-full gap-2'>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => appointmentCancel(item._id)}
                          className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition"
                        >
                          <img src={assets_admin.cancel_icon} className="w-4 h-4" alt="Cancel" />
                          Cancel
                        </button>
                        <button 
                          onClick={() => appointmentComplete(item._id)}
                          className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 transition"
                        >
                          <img src={assets_admin.tick_icon} className="w-4 h-4" alt="Complete" />
                          Done
                        </button>
                      </div>

                      {item.consultationType === 'online' && (
                        <div>
                          {item.videoCallStatus === 'active' ? (
                            <div className="flex gap-1">
                              <button 
                                onClick={() => window.open(`http://localhost:5173/video-call/${item._id}?dToken=${dToken}`, '_blank')}
                                className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs"
                              >
                                Join
                              </button>
                              <button 
                                onClick={() => endVideoCall(item._id)}
                                className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                              >
                                End
                              </button>
                            </div>
                          ) : item.videoCallStatus === 'ended' ? (
                            <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2.5 py-1 rounded-lg">Call Ended</span>
                          ) : (
                            <button 
                              onClick={() => {
                                if (!item.payment) {
                                  toast.error("Cannot start call. Payment pending.")
                                } else {
                                  startVideoCall(item._id)
                                }
                              }}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                                item.payment ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                              disabled={!item.payment}
                            >
                              {item.payment ? 'Start Call' : 'Unpaid'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">No appointments found</div>
          )}
        </div>

        <div className='hidden sm:block overflow-x-auto min-h-[50vh] max-h-[75vh] overflow-y-auto'>
          <div className='min-w-[780px]'>
            <div className='grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-2 py-3.5 px-6 border-b bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs'>
              <p>#</p>
              <p>Patient</p>
              <p>Payment</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Fees</p>
              <p className="text-right">Action</p>
            </div>

            <div className='divide-y divide-gray-100 text-xs sm:text-sm text-gray-700'>
              {appointments && appointments.length > 0 ? (
                [...appointments].reverse().map((item, index) => (
                  <div className='grid grid-cols-[0.5fr_2.5fr_1fr_1fr_2.5fr_1fr_1.5fr] gap-2 items-center py-3.5 px-6 hover:bg-gray-50/70 transition-colors' key={index}>
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

                    <div>
                      <span className='text-[10px] font-bold border border-primary text-primary px-2 py-0.5 rounded-full uppercase'>
                        {item.payment ? 'Online' : 'Cash'}
                      </span>
                    </div>

                    <p className='font-medium text-gray-600'>{calculateAge(item.userData?.dob)}</p>

                    <div>
                      <p className='font-semibold text-gray-800'>{item.slotDate}</p>
                      <p className='text-gray-400 text-xs mt-0.5'>{item.slotTime}</p>
                    </div>

                    <p className='font-bold text-gray-800'>{currency || '$'}{item.amount}</p>

                    <div className="flex justify-end items-center gap-2">
                      {item.cancelled ? (
                        <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-0.5 rounded border border-red-100">Cancelled</span>
                      ) : item.isCompleted ? (
                        <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Completed</span>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <button onClick={() => appointmentCancel(item._id)} title="Cancel Appointment" className="p-1 rounded hover:bg-red-50">
                            <img className='w-6 h-6 cursor-pointer hover:scale-110 transition' src={assets_admin.cancel_icon} alt="Cancel" />
                          </button>
                          <button onClick={() => appointmentComplete(item._id)} title="Complete Appointment" className="p-1 rounded hover:bg-emerald-50">
                            <img className='w-6 h-6 cursor-pointer hover:scale-110 transition' src={assets_admin.tick_icon} alt="Complete" />
                          </button>

                          {item.consultationType === 'online' && (
                            <div className="ml-1">
                              {item.videoCallStatus === 'active' ? (
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={() => window.open(`http://localhost:5173/video-call/${item._id}?dToken=${dToken}`, '_blank')}
                                    className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-emerald-600 transition"
                                  >
                                    Join
                                  </button>
                                  <button 
                                    onClick={() => endVideoCall(item._id)}
                                    className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-red-700 transition"
                                  >
                                    End
                                  </button>
                                </div>
                              ) : item.videoCallStatus === 'ended' ? (
                                <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded">Ended</span>
                              ) : (
                                <button 
                                  onClick={() => {
                                    if (!item.payment) {
                                      toast.error("Cannot start call. Payment has not been completed.")
                                    } else {
                                      startVideoCall(item._id)
                                    }
                                  }}
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded transition ${
                                    item.payment 
                                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                  disabled={!item.payment}
                                >
                                  {item.payment ? 'Start Call' : 'Unpaid'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
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

export default DoctorAppointments