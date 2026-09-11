import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"

const MyAppointment = () => {
  const navigate = useNavigate()
  const { backendurl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendurl + '/api/user/list-appointment', { headers: { token } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendurl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (responce) => {
        try {
          const { data } = await axios.post(backendurl + '/api/user/verify-razorpay', { responce }, { headers: { token } })
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointment')
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function (response) {
      toast.error("Payment Failed: " + response.error.description);
    });
    rzp.open()
  }

  const appointmentRazorPay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendurl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const checkRefundStatus = async (appointmentId) => {
    try {
      const { data } = await axios.get(backendurl + `/api/user/refund-status/${appointmentId}`, { headers: { token } })
      if (data.success) {
        toast.success(`Refund live status: ${data.refundStatus}`)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token])

  return (
    <div className="py-6 sm:py-8 w-full">
      <h1 className='pb-3 mb-6 font-bold text-xl sm:text-2xl text-gray-900 border-b border-gray-200 tracking-tight'>
        My Appointments
      </h1>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-gray-150">
            <p className="text-sm font-semibold text-gray-500">No appointments scheduled yet.</p>
            <button onClick={() => navigate('/doctors')} className="mt-3 text-xs text-primary font-bold hover:underline">
              Book a doctor now
            </button>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div 
              className='flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:border-gray-300 transition-all items-start sm:items-center justify-between' 
              key={index}
            >
              <div className="flex gap-4 items-start sm:items-center flex-1">
                <img className='w-24 sm:w-28 h-24 sm:h-28 object-cover object-top bg-indigo-50/60 rounded-xl border border-gray-100 flex-shrink-0' src={item.docData.image} alt={item.docData.name} />
                
                <div className='text-xs sm:text-sm text-gray-600 space-y-1 min-w-0'>
                  <p className='text-gray-900 font-bold text-base sm:text-lg tracking-tight truncate'>{item.docData.name}</p>
                  <p className='text-xs text-gray-500 font-medium'>{item.docData.speciality}</p>
                  
                  <div className="flex items-center gap-1.5 py-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.consultationType === 'online' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : 'bg-indigo-50 text-primary border-indigo-200'
                    }`}>
                      {item.consultationType === 'online' ? 'Online Consultation' : 'Clinic Visit'}
                    </span>
                  </div>

                  {item.consultationType === 'online' ? (
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-2 max-w-xs text-xs">
                      <p className="font-semibold text-emerald-700 text-[11px]">Virtual Call Room</p>
                      <p className="text-[10px] text-gray-500">Session link active upon physician start.</p>
                    </div>
                  ) : (
                    <div className="text-xs space-y-0.5 pt-0.5">
                      <p className='text-gray-700 font-medium'>Address: <span className="text-gray-500 font-normal">{item.docData.address?.line1 || item.docData.address || 'Booty More'}, {item.docData.address?.line2 || 'Ranchi'}</span></p>
                    </div>
                  )}

                  <p className='text-xs pt-1 text-gray-800 font-medium'>
                    <span className='text-gray-500 font-normal'>Date & Time: </span>
                    <span className="font-semibold">{slotDateFormat(item.slotDate)} | {item.slotTime}</span>
                  </p>
                </div>
              </div>

              <div className='flex flex-col gap-2.5 w-full sm:w-auto sm:min-w-[180px] pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100'>
                {!item.cancelled && !item.isCompleted && item.consultationType === 'online' && (
                  <button 
                    onClick={() => navigate(`/video-call/${item._id}`)}
                    className={`text-xs text-center py-2.5 px-4 rounded-xl border transition-all font-bold ${
                      item.videoCallStatus === 'active' 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500 shadow-md animate-pulse' 
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {item.videoCallStatus === 'active' ? 'Join Consultation (Active)' : 'Video Consultation (Pending)'}
                  </button>
                )}

                {item.cancelled && item.payment && (
                  <div className="flex flex-col gap-1.5 text-center">
                    <button className='w-full py-2.5 border rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed text-xs font-semibold'>Paid</button>
                    {item.refundStatus && item.refundStatus !== 'none' && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-indigo-600 font-bold">Refund Status: <span className="uppercase">{item.refundStatus}</span></p>
                        <button 
                          onClick={() => checkRefundStatus(item._id)}
                          className="text-[10px] text-primary underline hover:text-opacity-80 font-medium"
                        >
                          Refresh Status
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {item.isCompleted && (
                  <button className='py-2.5 border border-emerald-500 rounded-xl text-emerald-600 font-bold text-xs bg-emerald-50/20 cursor-default text-center'>
                    Completed
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && !item.payment && (
                  <button onClick={() => appointmentRazorPay(item._id)} className='text-xs text-gray-700 text-center py-2.5 px-4 border border-gray-300 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-bold shadow-sm'>
                    Pay Online
                  </button>
                )}
                
                {!item.cancelled && !item.isCompleted && (
                  <button onClick={() => cancelAppointment(item._id)} className='text-xs text-gray-600 text-center py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 font-semibold'>
                    Cancel Appointment
                  </button>
                )}
                
                {item.cancelled && !item.payment && (
                  <button className='py-2.5 border border-red-200 rounded-xl text-red-500 font-bold text-xs bg-red-50/30 text-center'>
                    Appointment Cancelled
                  </button>
                )}
                {item.cancelled && item.payment && !item.refundStatus && (
                  <button className='py-2.5 border border-red-200 rounded-xl text-red-500 font-bold text-xs bg-red-50/30 text-center'>
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyAppointment
