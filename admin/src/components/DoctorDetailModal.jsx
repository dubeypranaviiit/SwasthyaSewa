import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../context/AdminContext'
import { AppContext } from '../context/AppContext'

const DoctorDetailModal = ({ docId, onClose, onAvailabilityChange }) => {
  const { backendUrl, aToken } = useContext(AdminContext)
  const { currency, calculateAge } = useContext(AppContext)

  const [doctorData, setDoctorData] = useState(null)
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('appointments')

  const fetchDoctorOverview = async () => {
    if (!docId) return
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/admin/doctor-overview/${docId}`, {
        headers: { aToken }
      })

      if (data.success) {
        setDoctorData(data.doctor)
        setStats(data.stats)
        setAppointments(data.appointments || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching doctor overview:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch doctor details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctorOverview()
  }, [docId, aToken])

  const handleToggleAvailability = async () => {
    if (!doctorData) return
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId: doctorData._id },
        { headers: { aToken } }
      )
      if (data.success) {
        toast.success(data.message || 'Availability updated')
        setDoctorData(prev => ({ ...prev, available: !prev.available }))
        if (onAvailabilityChange) onAvailabilityChange()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getAddressString = (address) => {
    if (!address) return 'Not specified'
    if (typeof address === 'object') {
      return `${address.line1 || ''} ${address.line2 || ''}`.trim() || 'Not specified'
    }
    return address
  }

  const prescriptionsList = appointments.filter(
    item => item.prescription && (item.prescription.diagnosis || (item.prescription.medicines && item.prescription.medicines.length > 0))
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-gray-150 my-6 max-h-[92vh] flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Doctor 360-Degree Profile & Clinical Records
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Comprehensive performance overview, practice history, and patient consultations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-lg font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          {loading ? (
            <div className="py-20 text-center text-gray-400 text-xs">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p>Loading doctor profile and analytics...</p>
            </div>
          ) : !doctorData ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Doctor data could not be found.
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={doctorData.image}
                    alt={doctorData.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-50 shadow-xs bg-indigo-50/50"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{doctorData.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-primary border border-indigo-100">
                        {doctorData.speciality}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {doctorData.degree} | {doctorData.experience} experience
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      Email: {doctorData.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Clinic: {getAddressString(doctorData.address)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Consultation Fee</span>
                    <p className="text-lg font-bold text-gray-900">{currency || '$'}{doctorData.fees}</p>
                  </div>
                  <button
                    onClick={handleToggleAvailability}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      doctorData.available
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${doctorData.available ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                    {doctorData.available ? 'Status: Active & Available' : 'Status: Unavailable'}
                  </button>
                </div>
              </div>

              {doctorData.about && (
                <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700">
                  <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider mb-1">Doctor Biography</p>
                  <p className="leading-relaxed">{doctorData.about}</p>
                </div>
              )}

              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Gross Earnings</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{currency || '$'}{stats.totalEarnings?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Consultations</p>
                    <p className="text-xl font-bold text-indigo-600 mt-1">{stats.totalAppointments || 0}</p>
                    <span className="text-[10px] text-gray-400">{stats.completedAppointments} Done | {stats.cancelledAppointments} Cancelled</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Patients Treated</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{stats.totalPatients || 0}</p>
                    <span className="text-[10px] text-gray-400">{stats.onlineConsultations} Online | {stats.offlineConsultations} Clinic</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-xs">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prescriptions Issued</p>
                    <p className="text-xl font-bold text-amber-600 mt-1">{stats.prescriptionsIssued || 0}</p>
                    <span className="text-[10px] text-gray-400">Digital EHR Records</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
                      activeTab === 'appointments'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    All Appointments ({appointments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
                      activeTab === 'prescriptions'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Prescriptions Authored ({prescriptionsList.length})
                  </button>
                </div>

                {activeTab === 'appointments' && (
                  <div className="border border-gray-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Patient</th>
                          <th className="py-2.5 px-3">Age/Gender</th>
                          <th className="py-2.5 px-3">Date & Slot</th>
                          <th className="py-2.5 px-3">Mode</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Prescription</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {appointments.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-8 text-center text-gray-400 text-xs">
                              No consultations found for this doctor.
                            </td>
                          </tr>
                        ) : (
                          appointments.map((item, index) => {
                            const user = item.userData || {}
                            const rx = item.prescription
                            return (
                              <tr key={index} className="hover:bg-gray-50/60">
                                <td className="py-2.5 px-3 text-gray-400 font-semibold">{index + 1}</td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={user.image}
                                      alt={user.name}
                                      className="w-7 h-7 rounded-lg object-cover border border-gray-100 bg-gray-100"
                                    />
                                    <span className="font-bold text-gray-800">{user.name || 'Patient'}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-gray-600">
                                  {calculateAge ? calculateAge(user.dob) : 'N/A'} yrs / {user.gender || 'N/A'}
                                </td>
                                <td className="py-2.5 px-3 text-gray-700">
                                  <span className="font-semibold">{item.slotDate}</span>
                                  <span className="text-gray-400 text-[11px] block">{item.slotTime}</span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                    item.consultationType === 'online'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : 'bg-indigo-50 text-primary border-indigo-100'
                                  }`}>
                                    {item.consultationType || 'offline'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-gray-800">
                                  {currency || '$'}{item.amount}
                                </td>
                                <td className="py-2.5 px-3">
                                  {item.cancelled ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                                      Cancelled
                                    </span>
                                  ) : item.isCompleted ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200">
                                      Scheduled
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  {rx && rx.diagnosis ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-primary border border-indigo-100">
                                      Dx: {rx.diagnosis}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-[11px]">None</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'prescriptions' && (
                  <div className="space-y-3">
                    {prescriptionsList.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-xs border border-gray-200 rounded-xl bg-gray-50/50">
                        No digital prescriptions issued yet by this doctor.
                      </div>
                    ) : (
                      prescriptionsList.map((item, index) => {
                        const rx = item.prescription
                        const user = item.userData || {}
                        return (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                              <div>
                                <p className="font-bold text-gray-900 text-xs sm:text-sm">
                                  Patient: {user.name} ({user.gender || 'N/A'})
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  Date: {item.slotDate} | Ref #{item._id?.slice(-8).toUpperCase()}
                                </p>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-primary border border-indigo-100">
                                Diagnosis: {rx.diagnosis || 'General Consultation'}
                              </span>
                            </div>

                            {rx.vitals && (rx.vitals.bp || rx.vitals.pulse || rx.vitals.temperature || rx.vitals.weight) && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-2 rounded-lg text-[11px] text-center border border-gray-100">
                                {rx.vitals.bp && <div><span className="text-gray-400 block text-[9px]">BP</span><span className="font-semibold">{rx.vitals.bp}</span></div>}
                                {rx.vitals.pulse && <div><span className="text-gray-400 block text-[9px]">Pulse</span><span className="font-semibold">{rx.vitals.pulse}</span></div>}
                                {rx.vitals.temperature && <div><span className="text-gray-400 block text-[9px]">Temp</span><span className="font-semibold">{rx.vitals.temperature}</span></div>}
                                {rx.vitals.weight && <div><span className="text-gray-400 block text-[9px]">Weight</span><span className="font-semibold">{rx.vitals.weight}</span></div>}
                              </div>
                            )}

                            {rx.medicines && rx.medicines.length > 0 && (
                              <div className="border border-gray-150 rounded-lg overflow-x-auto">
                                <table className="w-full text-left text-[11px] border-collapse">
                                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-150">
                                    <tr>
                                      <th className="py-1.5 px-2">Medicine</th>
                                      <th className="py-1.5 px-2">Dosage & Frequency</th>
                                      <th className="py-1.5 px-2">Duration</th>
                                      <th className="py-1.5 px-2">Instructions</th>
                                      <th className="py-1.5 px-2 text-right">Qty</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {rx.medicines.map((m, mIdx) => (
                                      <tr key={mIdx}>
                                        <td className="py-1.5 px-2 font-bold text-gray-800">{m.name}</td>
                                        <td className="py-1.5 px-2 text-gray-600">{m.dosage || '1 Tab'} ({m.frequency})</td>
                                        <td className="py-1.5 px-2 text-gray-600">{m.duration}</td>
                                        <td className="py-1.5 px-2 text-gray-600">{m.timing}</td>
                                        <td className="py-1.5 px-2 text-right font-semibold text-gray-800">{m.quantity}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {rx.advice && (
                              <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="font-bold text-gray-700">Advice: </span>{rx.advice}
                              </p>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-150 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailModal
