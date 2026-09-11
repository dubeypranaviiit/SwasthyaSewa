import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets_admin } from '../../assets/assets_admin/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import PrescriptionModal from '../../components/PrescriptionModal'
import PatientHistoryDrawer from '../../components/PatientHistoryDrawer'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, appointmentComplete, appointmentCancel, backendUrl, frontendUrl } = useContext(DoctorContext)
  const { currency, calculateAge } = useContext(AppContext)
  const [activePrescriptionAppointment, setActivePrescriptionAppointment] = useState(null)
  const [activeHistoryPatient, setActiveHistoryPatient] = useState(null)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  const startVideoCall = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/video/start-call`, { appointmentId }, { headers: { dToken } })
      if (data.success) {
        toast.success("Video call started successfully!")
        getDashData()
        window.open(`${frontendUrl}/video-call/${appointmentId}?dToken=${dToken}`, '_blank')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return dashData && (
    <div className='w-full space-y-6 sm:space-y-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        <div className='flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300'>
          <div className='p-3.5 rounded-xl bg-indigo-50 flex-shrink-0'>
            <img className='w-10 h-10 object-contain' src={assets_admin.earning_icon} alt="Earnings" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{currency || '$'} {dashData.earnings ? dashData.earnings.toLocaleString() : 0}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5'>Total Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300'>
          <div className='p-3.5 rounded-xl bg-emerald-50 flex-shrink-0'>
            <img className='w-10 h-10 object-contain' src={assets_admin.appointments_icon} alt="Appointments" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.appointments}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1'>
          <div className='p-3.5 rounded-xl bg-blue-50 flex-shrink-0'>
            <img className='w-10 h-10 object-contain' src={assets_admin.patients_icon} alt="Patients" />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.patients}</p>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5'>Total Patients</p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
          <img className='w-5 h-5' src={assets_admin.list_icon} alt="List" />
          <h2 className='font-bold text-gray-800 text-sm sm:text-base'>Latest Bookings</h2>
        </div>

        <div className='divide-y divide-gray-100'>
          {!dashData.latestAppointments || dashData.latestAppointments.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
              <p className='text-sm font-medium'>No appointments booked yet</p>
            </div>
          ) : (
            dashData.latestAppointments.map((item, index) => (
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 hover:bg-gray-50/70 transition-all' key={index}>
                <div className='flex items-center gap-3 min-w-0'>
                  <img className='rounded-full w-11 h-11 object-cover border-2 border-indigo-50 shadow-xs flex-shrink-0' src={item.userData?.image} alt={item.userData?.name} />
                  <div className='min-w-0 flex-1'>
                    <p className='text-gray-800 font-semibold text-sm truncate'>{item.userData?.name}</p>
                    <div className='flex items-center gap-2 mt-1 flex-wrap'>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        item.consultationType === 'online'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      }`}>
                        {item.consultationType || 'offline'}
                      </span>
                      <span className='text-xs text-gray-400 font-medium'>
                        Age: {calculateAge(item.userData?.dob)}
                      </span>
                      <button
                        onClick={() => setActiveHistoryPatient({ userId: item.userId, name: item.userData?.name })}
                        className="text-[9px] bg-gray-100 text-gray-700 border border-gray-200 px-1.5 py-0.5 rounded font-bold hover:bg-gray-200 transition"
                      >
                        History
                      </button>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100'>
                  <div className='text-xs sm:text-sm text-gray-600 font-medium'>
                    <p className='text-gray-800 font-semibold'>{item.slotDate}</p>
                    <p className='text-[11px] text-gray-400 mt-0.5'>{item.slotTime}</p>
                  </div>

                  <div className='text-xs sm:text-sm font-semibold text-gray-700 text-right'>
                    <p className='text-gray-800 font-bold'>{currency || '$'}{item.amount}</p>
                    <p className='text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider'>{item.payment ? 'Online Paid' : 'Cash'}</p>
                  </div>

                  <div className='flex items-center gap-2 justify-end'>
                    {item.cancelled ? (
                      <span className="text-red-500 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-md border border-red-100">Cancelled</span>
                    ) : item.isCompleted ? (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Completed</span>
                        <button
                          onClick={() => setActivePrescriptionAppointment(item)}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/80 text-primary hover:bg-indigo-100 transition"
                        >
                          {item.prescription?.diagnosis ? 'View / Edit Rx' : 'Write Rx'}
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => setActivePrescriptionAppointment(item)}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50/80 text-primary hover:bg-indigo-100 transition"
                          title="Prescribe Medication"
                        >
                          {item.prescription?.diagnosis ? 'Edit Rx' : 'Write Rx'}
                        </button>
                        
                        {item.consultationType === 'online' && (
                          <button
                            onClick={() => {
                              if (!item.payment) {
                                toast.error("Cannot start call. Payment has not been completed.")
                              } else {
                                startVideoCall(item._id)
                              }
                            }}
                            className={`font-bold text-[10px] sm:text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition ${
                              item.payment 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!item.payment}
                          >
                            {item.payment ? 'Start Call' : 'Unpaid'}
                          </button>
                        )}
                        
                        <button 
                          onClick={() => appointmentCancel(item._id)}
                          className='p-1.5 hover:bg-red-50 rounded-lg border border-gray-100 hover:border-red-100 transition'
                          title="Cancel Appointment"
                        >
                          <img className='w-5 h-5 cursor-pointer hover:scale-105 transition' src={assets_admin.cancel_icon} alt="Cancel" />
                        </button>

                        <button 
                          onClick={() => appointmentComplete(item._id)}
                          className='p-1.5 hover:bg-emerald-50 rounded-lg border border-gray-100 hover:border-emerald-100 transition'
                          title="Complete Appointment"
                        >
                          <img className='w-5 h-5 cursor-pointer hover:scale-105 transition' src={assets_admin.tick_icon} alt="Complete" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {activePrescriptionAppointment && (
        <PrescriptionModal
          appointment={activePrescriptionAppointment}
          onClose={() => setActivePrescriptionAppointment(null)}
          onSuccess={() => {
            getDashData()
            setActivePrescriptionAppointment(null)
          }}
        />
      )}

      {activeHistoryPatient && (
        <PatientHistoryDrawer
          userId={activeHistoryPatient.userId}
          patientName={activeHistoryPatient.name}
          onClose={() => setActiveHistoryPatient(null)}
        />
      )}
    </div>
  )
}

export default DoctorDashboard