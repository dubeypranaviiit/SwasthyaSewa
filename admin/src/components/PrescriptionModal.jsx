import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { AppContext } from '../context/AppContext'

const PrescriptionModal = ({ appointment, onClose, onSuccess }) => {
  const { backendUrl, dToken } = useContext(DoctorContext)
  const { calculateAge } = useContext(AppContext)

  const initialPrescription = appointment?.prescription || {}

  const [diagnosis, setDiagnosis] = useState(initialPrescription.diagnosis || '')
  const [symptoms, setSymptoms] = useState(
    initialPrescription.symptoms?.length ? initialPrescription.symptoms.join(', ') : ''
  )
  const [vitals, setVitals] = useState({
    bp: initialPrescription.vitals?.bp || '',
    pulse: initialPrescription.vitals?.pulse || '',
    temperature: initialPrescription.vitals?.temperature || '',
    weight: initialPrescription.vitals?.weight || ''
  })
  const [medicines, setMedicines] = useState(
    initialPrescription.medicines?.length > 0
      ? initialPrescription.medicines
      : [
          {
            name: '',
            dosage: '1 Tab',
            frequency: '1-0-1',
            duration: '5 Days',
            timing: 'After Food',
            quantity: 10
          }
        ]
  )
  const [advice, setAdvice] = useState(initialPrescription.advice || '')
  const [labTests, setLabTests] = useState(initialPrescription.labTests || '')
  const [nextFollowUpDate, setNextFollowUpDate] = useState(initialPrescription.nextFollowUpDate || '')
  const [loading, setLoading] = useState(false)

  const handleVitalChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value }))
  }

  const handleMedicineChange = (index, field, value) => {
    setMedicines(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const addMedicineRow = () => {
    setMedicines(prev => [
      ...prev,
      {
        name: '',
        dosage: '1 Tab',
        frequency: '1-0-1',
        duration: '5 Days',
        timing: 'After Food',
        quantity: 10
      }
    ])
  }

  const removeMedicineRow = (index) => {
    if (medicines.length === 1) {
      toast.warning('Prescription must contain at least one medicine entry.')
      return
    }
    setMedicines(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!diagnosis.trim()) {
      toast.error('Please enter a clinical diagnosis.')
      return
    }

    const invalidMed = medicines.find(m => !m.name.trim())
    if (invalidMed) {
      toast.error('Please specify medicine names for all rows.')
      return
    }

    const parsedSymptoms = symptoms
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const prescriptionData = {
      diagnosis: diagnosis.trim(),
      symptoms: parsedSymptoms,
      vitals,
      medicines: medicines.map(m => ({
        name: m.name.trim(),
        dosage: m.dosage || '1 Tab',
        frequency: m.frequency || '1-0-1',
        duration: m.duration || '5 Days',
        timing: m.timing || 'After Food',
        quantity: Number(m.quantity) || 1
      })),
      advice: advice.trim(),
      labTests: labTests.trim(),
      nextFollowUpDate
    }

    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/save-prescription`,
        {
          appointmentId: appointment._id,
          prescriptionData
        },
        {
          headers: { dToken }
        }
      )

      if (data.success) {
        toast.success(data.message || 'Prescription saved successfully')
        if (onSuccess) onSuccess()
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Save prescription error:', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-150 my-6 max-h-[92vh] flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/70">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Clinical Prescription Workstation
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ref ID: #{appointment?._id?.slice(-8).toUpperCase()} | Date: {appointment?.slotDate} ({appointment?.slotTime})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-lg font-bold"
            aria-label="Close prescription modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-gray-500 font-semibold uppercase text-[10px]">Patient Name</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{appointment?.userData?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase text-[10px]">Age / Gender</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">
                {calculateAge ? calculateAge(appointment?.userData?.dob) : 'N/A'} yrs / {appointment?.userData?.gender || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase text-[10px]">Consultation Mode</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border border-indigo-200 text-indigo-700">
                {appointment?.consultationType || 'offline'}
              </span>
            </div>
            <div>
              <p className="text-gray-500 font-semibold uppercase text-[10px]">Blood Group</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{appointment?.userData?.bloodGroup || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">
              Patient Vitals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  placeholder="e.g. 120/80 mmHg"
                  value={vitals.bp}
                  onChange={(e) => handleVitalChange('bp', e.target.value)}
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pulse Rate</label>
                <input
                  type="text"
                  placeholder="e.g. 72 bpm"
                  value={vitals.pulse}
                  onChange={(e) => handleVitalChange('pulse', e.target.value)}
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Temperature</label>
                <input
                  type="text"
                  placeholder="e.g. 98.6 °F"
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Body Weight</label>
                <input
                  type="text"
                  placeholder="e.g. 68 kg"
                  value={vitals.weight}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acute Bronchitis, Hypertension Stage 1"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">
                Reported Symptoms (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. High fever, Persistent cough, Headache"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                Prescribed Medications (Rx Schedule)
              </h3>
              <button
                type="button"
                onClick={addMedicineRow}
                className="text-xs font-bold text-primary bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-100 transition"
              >
                + Add Medicine Row
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 min-w-[150px]">Medicine Name</th>
                    <th className="py-2.5 px-3 min-w-[100px]">Dosage</th>
                    <th className="py-2.5 px-3 min-w-[90px]">Frequency</th>
                    <th className="py-2.5 px-3 min-w-[90px]">Duration</th>
                    <th className="py-2.5 px-3 min-w-[110px]">Timing</th>
                    <th className="py-2.5 px-3 min-w-[70px]">Qty</th>
                    <th className="py-2.5 px-3 text-center w-[50px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.map((med, index) => (
                    <tr key={index} className="hover:bg-gray-50/60">
                      <td className="p-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paracetamol 650mg"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="1 Tab / 5ml"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary bg-white"
                        >
                          <option value="1-0-1">1-0-1 (Twice daily)</option>
                          <option value="1-0-0">1-0-0 (Morning only)</option>
                          <option value="0-0-1">0-0-1 (Night only)</option>
                          <option value="1-1-1">1-1-1 (Thrice daily)</option>
                          <option value="1-1-1-1">1-1-1-1 (Four times)</option>
                          <option value="SOS">SOS (When needed)</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="5 Days"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={med.timing}
                          onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary bg-white"
                        >
                          <option value="After Food">After Food</option>
                          <option value="Before Food">Before Food</option>
                          <option value="With Food">With Food</option>
                          <option value="Empty Stomach">Empty Stomach</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={med.quantity}
                          onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeMedicineRow(index)}
                          className="text-red-500 hover:text-red-700 font-bold p-1 rounded hover:bg-red-50 transition"
                          title="Remove row"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">
                Clinical Advice & Dietary Instructions
              </label>
              <textarea
                rows="3"
                placeholder="e.g. Maintain hydration, avoid oily food, get adequate bed rest."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full border border-gray-250 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              ></textarea>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">
                  Suggested Lab Investigations / Tests
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complete Blood Count (CBC), Serum Creatinine"
                  value={labTests}
                  onChange={(e) => setLabTests(e.target.value)}
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">
                  Scheduled Follow-up Date
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full border border-gray-250 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-[#4351ea] text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition flex items-center gap-2"
            >
              {loading ? 'Saving Prescription...' : 'Save & Complete Consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PrescriptionModal
