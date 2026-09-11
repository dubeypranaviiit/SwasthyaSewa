import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import PrescriptionPDF from '../components/PrescriptionPDF'

const MedicalHistory = () => {
  const navigate = useNavigate()
  const { backendurl, token } = useContext(AppContext)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPrescriptionAppointment, setSelectedPrescriptionAppointment] = useState(null)

  const fetchMedicalHistory = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.get(`${backendurl}/api/user/medical-history`, {
        headers: { token }
      })

      if (data.success) {
        setHistory(data.history || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching medical history:', error)
      toast.error(error.response?.data?.message || 'Failed to load medical history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicalHistory()
  }, [token])

  const getDoctorDetails = (docData) => {
    if (!docData) return { name: 'Doctor', speciality: 'General Physician', image: '' }
    if (typeof docData === 'object') {
      return {
        name: docData.name || 'Doctor',
        speciality: docData.speciality || 'General Physician',
        image: docData.image || ''
      }
    }
    if (typeof docData === 'string') {
      const nameMatch = docData.match(/name:\s*'([^']+)'/)
      const specMatch = docData.match(/speciality:\s*'([^']+)'/)
      return {
        name: nameMatch ? nameMatch[1] : 'Doctor',
        speciality: specMatch ? specMatch[1] : 'General Physician',
        image: ''
      }
    }
    return { name: 'Doctor', speciality: 'General Physician', image: '' }
  }

  const formatDisplayDate = (dateVal) => {
    if (!dateVal) return 'N/A'
    if (typeof dateVal === 'number') {
      return new Date(dateVal).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    return dateVal
  }

  return (
    <div className="py-6 sm:py-8 w-full space-y-6">
      <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Medical Records & Health History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access your longitudinal clinical visits, digital prescriptions, and checkup summaries.
          </p>
        </div>
        <button
          onClick={() => navigate('/my-appointment')}
          className="self-start sm:self-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-primary border border-indigo-200 rounded-xl text-xs font-bold transition"
        >
          View Active Bookings
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400 text-xs sm:text-sm">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p>Retrieving your health records...</p>
        </div>
      ) : !token ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Please sign in to view your medical history.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#4351ea] transition"
          >
            Sign In
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-3">
          <p className="text-sm font-semibold text-gray-700">No medical records or prescriptions found.</p>
          <p className="text-xs text-gray-500">
            Once you complete a consultation or checkup, records will be archived here automatically.
          </p>
          <button
            onClick={() => navigate('/doctors')}
            className="mt-2 px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-[#4351ea] transition"
          >
            Book a Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => {
            const doctor = getDoctorDetails(item.docData)
            const rx = item.prescription
            const checkup = item.checkupReport

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-gray-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
                        Dr
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-base">{doctor.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{doctor.speciality}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Consultation: {item.slotDate} ({item.slotTime}) | Ref #{item._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.consultationType === 'online'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-indigo-50 text-primary border-indigo-200'
                    }`}>
                      {item.consultationType === 'online' ? 'Online Video' : 'In-Clinic'}
                    </span>

                    {rx?.diagnosis && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Dx: {rx.diagnosis}
                      </span>
                    )}
                  </div>
                </div>

                {rx?.vitals && (rx.vitals.bp || rx.vitals.pulse || rx.vitals.temperature || rx.vitals.weight) && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Recorded Vitals</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-xs text-center">
                      {rx.vitals.bp && <div><span className="text-gray-400 block text-[10px]">BP</span><span className="font-bold text-gray-800">{rx.vitals.bp}</span></div>}
                      {rx.vitals.pulse && <div><span className="text-gray-400 block text-[10px]">Pulse</span><span className="font-bold text-gray-800">{rx.vitals.pulse}</span></div>}
                      {rx.vitals.temperature && <div><span className="text-gray-400 block text-[10px]">Temp</span><span className="font-bold text-gray-800">{rx.vitals.temperature}</span></div>}
                      {rx.vitals.weight && <div><span className="text-gray-400 block text-[10px]">Weight</span><span className="font-bold text-gray-800">{rx.vitals.weight}</span></div>}
                    </div>
                  </div>
                )}

                {rx?.medicines && rx.medicines.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prescribed Medication Schedule</p>
                    <div className="border border-gray-200 rounded-xl overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-[10px] uppercase">
                          <tr>
                            <th className="py-2 px-3">Medicine</th>
                            <th className="py-2 px-3">Dosage & Frequency</th>
                            <th className="py-2 px-3">Duration</th>
                            <th className="py-2 px-3">Instructions</th>
                            <th className="py-2 px-3 text-right">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {rx.medicines.map((m, mIdx) => (
                            <tr key={mIdx} className="hover:bg-gray-50/50">
                              <td className="py-2 px-3 font-bold text-gray-800">{m.name}</td>
                              <td className="py-2 px-3 text-gray-600">{m.dosage || '1 Tab'} ({m.frequency})</td>
                              <td className="py-2 px-3 text-gray-600">{m.duration}</td>
                              <td className="py-2 px-3 text-gray-600">{m.timing}</td>
                              <td className="py-2 px-3 text-right font-semibold text-gray-800">{m.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {(rx?.advice || rx?.labTests) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {rx.advice && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider mb-0.5">Clinical Advice</p>
                        <p className="text-gray-600">{rx.advice}</p>
                      </div>
                    )}
                    {rx.labTests && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider mb-0.5">Suggested Tests</p>
                        <p className="text-gray-600">{rx.labTests}</p>
                      </div>
                    )}
                  </div>
                )}

                {rx?.nextFollowUpDate && (
                  <div className="text-xs bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between text-indigo-900">
                    <span className="font-semibold">Next Follow-up Reminder:</span>
                    <span className="font-extrabold">{rx.nextFollowUpDate}</span>
                  </div>
                )}

                {!rx && checkup && (
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 text-xs text-gray-700">
                    <p className="font-bold text-emerald-800 text-[11px] mb-1">Pre-consultation Checkup Summary</p>
                    <p><span className="font-semibold text-gray-600">Symptoms:</span> {checkup.symptoms?.join(', ') || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-600">Severity:</span> {checkup.severity || 'Normal'}</p>
                    {checkup.advice && <p className="mt-1 text-gray-600"><span className="font-semibold">Advice:</span> {checkup.advice}</p>}
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-gray-400">
                    Recorded Date: {formatDisplayDate(rx?.prescribedAt || item.date)}
                  </span>
                  
                  {rx?.medicines && rx.medicines.length > 0 ? (
                    <button
                      onClick={() => setSelectedPrescriptionAppointment(item)}
                      className="px-4 py-2 bg-primary hover:bg-[#4351ea] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      Download Prescription PDF
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium">Digital Prescription Not Issued</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedPrescriptionAppointment && (
        <PrescriptionPDF
          appointment={selectedPrescriptionAppointment}
          onClose={() => setSelectedPrescriptionAppointment(null)}
        />
      )}
    </div>
  )
}

export default MedicalHistory
