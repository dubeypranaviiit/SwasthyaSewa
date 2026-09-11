import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const PatientHistoryDrawer = ({ userId, patientName, onClose }) => {
  const { backendUrl, dToken } = useContext(DoctorContext)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatientHistory = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data } = await axios.get(
          `${backendUrl}/api/doctor/patient-history/${userId}`,
          { headers: { dToken } }
        )

        if (data.success) {
          setHistory(data.history || [])
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching patient history:', error)
        toast.error(error.response?.data?.message || 'Failed to fetch patient history')
      } finally {
        setLoading(false)
      }
    }

    fetchPatientHistory()
  }, [userId, backendUrl, dToken])

  const formatDate = (dateVal) => {
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

  const getDoctorName = (docData) => {
    if (!docData) return 'Physician'
    if (typeof docData === 'object' && docData.name) return docData.name
    if (typeof docData === 'string') {
      const match = docData.match(/name:\s*'([^']+)'/)
      return match ? match[1] : 'Physician'
    }
    return 'Physician'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        
        <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Patient Medical History Timeline
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Patient: <span className="font-semibold text-gray-800">{patientName || 'Patient Record'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-lg font-bold"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-xs">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Loading medical timeline...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-xs sm:text-sm">
              <p className="font-semibold">No prior medical records or prescriptions found.</p>
              <p className="text-gray-400 text-xs mt-1">Previous consultations and prescriptions will appear here.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-indigo-100 ml-3 pl-6 space-y-6">
              {history.map((item, index) => {
                const rx = item.prescription
                const checkup = item.checkupReport
                const doctorName = getDoctorName(item.docData)

                return (
                  <div key={index} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-white shadow-xs"></div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:border-gray-300 transition-all space-y-3">
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            Dr. {doctorName}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Consultation: {item.slotDate} ({item.slotTime}) | Mode: <span className="uppercase font-semibold">{item.consultationType || 'offline'}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {rx?.diagnosis && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              Dx: {rx.diagnosis}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                            {item.isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {rx?.vitals && (rx.vitals.bp || rx.vitals.pulse || rx.vitals.temperature || rx.vitals.weight) && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Recorded Vitals</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-2.5 rounded-lg text-[11px] text-gray-700 border border-gray-100 text-center">
                            {rx.vitals.bp && <div><span className="text-gray-400 block text-[9px]">BP</span><span className="font-semibold">{rx.vitals.bp}</span></div>}
                            {rx.vitals.pulse && <div><span className="text-gray-400 block text-[9px]">Pulse</span><span className="font-semibold">{rx.vitals.pulse}</span></div>}
                            {rx.vitals.temperature && <div><span className="text-gray-400 block text-[9px]">Temp</span><span className="font-semibold">{rx.vitals.temperature}</span></div>}
                            {rx.vitals.weight && <div><span className="text-gray-400 block text-[9px]">Weight</span><span className="font-semibold">{rx.vitals.weight}</span></div>}
                          </div>
                        </div>
                      )}

                      {rx?.medicines && rx.medicines.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Prescribed Medicines</p>
                          <div className="border border-gray-150 rounded-lg overflow-x-auto">
                            <table className="w-full text-left text-[11px] border-collapse">
                              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-150">
                                <tr>
                                  <th className="py-1.5 px-2">Medicine</th>
                                  <th className="py-1.5 px-2">Dosage</th>
                                  <th className="py-1.5 px-2">Frequency</th>
                                  <th className="py-1.5 px-2">Duration</th>
                                  <th className="py-1.5 px-2">Instructions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {rx.medicines.map((m, mIdx) => (
                                  <tr key={mIdx} className="hover:bg-gray-50/50">
                                    <td className="py-1.5 px-2 font-bold text-gray-800">{m.name}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{m.dosage || '1 Tab'}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{m.frequency}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{m.duration}</td>
                                    <td className="py-1.5 px-2 text-gray-600">{m.timing}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {rx?.advice && (
                        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
                          <span className="font-bold text-gray-700 text-[11px] block">Doctor Advice:</span>
                          <p className="text-gray-600 mt-0.5">{rx.advice}</p>
                        </div>
                      )}

                      {rx?.labTests && (
                        <div className="text-xs">
                          <span className="font-bold text-gray-700 text-[11px]">Recommended Lab Tests: </span>
                          <span className="text-gray-600">{rx.labTests}</span>
                        </div>
                      )}

                      {rx?.nextFollowUpDate && (
                        <p className="text-[11px] text-indigo-600 font-semibold">
                          Follow-up Scheduled: {rx.nextFollowUpDate}
                        </p>
                      )}

                      {!rx && checkup && (
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 text-xs text-gray-700">
                          <p className="font-bold text-emerald-800 text-[11px] mb-1">Pre-consultation Checkup</p>
                          <p><span className="font-semibold text-gray-600">Symptoms:</span> {checkup.symptoms?.join(', ') || 'N/A'}</p>
                          <p><span className="font-semibold text-gray-600">Severity:</span> {checkup.severity || 'Normal'}</p>
                          {checkup.advice && <p className="mt-1 text-gray-600"><span className="font-semibold">AI Advice:</span> {checkup.advice}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-150 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientHistoryDrawer
