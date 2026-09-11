import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Heart, 
  Activity, 
  Thermometer, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertTriangle, 
  Plus, 
  User,
  BriefcaseMedical,
  Stethoscope
} from 'lucide-react'

const OnlineCheckup = () => {
  const navigate = useNavigate()
  const { token, backendurl } = useContext(AppContext)
  
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [savedReportId, setSavedReportId] = useState(null)

  const [age, setAge] = useState('')
  const [gender, setGender] = useState('Male')
  const [duration, setDuration] = useState('1-2 Days')
  const [temperature, setTemperature] = useState('98.6')
  const [heartRate, setHeartRate] = useState('75')
  const [bloodPressure, setBloodPressure] = useState('120/80')

  const availableSymptoms = [
    { name: 'Fever', category: 'General' },
    { name: 'Cough', category: 'Respiratory' },
    { name: 'Shortness of breath', category: 'Respiratory' },
    { name: 'Sore throat', category: 'Respiratory' },
    { name: 'Headache', category: 'Neurological' },
    { name: 'Body aches', category: 'General' },
    { name: 'Fatigue', category: 'General' },
    { name: 'Nausea / Vomiting', category: 'Digestive' },
    { name: 'Stomach Ache', category: 'Digestive' },
    { name: 'Diarrhea', category: 'Digestive' },
    { name: 'Skin Rash', category: 'Dermatological' },
    { name: 'Itching', category: 'Dermatological' },
    { name: 'Joint Pain', category: 'General' },
    { name: 'Dizziness', category: 'Neurological' },
    { name: 'Chest tightness', category: 'Cardiovascular' }
  ]

  const [selectedSymptoms, setSelectedSymptoms] = useState([])

  const toggleSymptom = (name) => {
    if (selectedSymptoms.includes(name)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== name))
    } else {
      setSelectedSymptoms([...selectedSymptoms, name])
    }
  }

  const analyzeSymptoms = () => {
    let severity = 'Low'
    let recommendedSpecialty = 'General physician'
    let advice = 'Your symptoms appear mild. Get adequate rest, stay hydrated, and monitor your condition. If symptoms persist or worsen, please consult a general physician.'

    if (selectedSymptoms.some(s => ['Skin Rash', 'Itching'].includes(s))) {
      recommendedSpecialty = 'Dermatologist'
      advice = 'A dermatologist is recommended to examine skin irritations, rashes, or persistent itching. Keep the area clean and avoid scratching.'
    } else if (selectedSymptoms.some(s => ['Nausea / Vomiting', 'Stomach Ache', 'Diarrhea'].includes(s))) {
      recommendedSpecialty = 'Gastroenterologist'
      advice = 'A gastroenterologist is recommended for digestive distress. Stay hydrated with electrolytes and eat bland, non-spicy foods.'
    } else if (selectedSymptoms.some(s => ['Shortness of breath', 'Chest tightness'].includes(s))) {
      recommendedSpecialty = 'General physician'
      severity = 'High'
      advice = 'Urgent attention is advised. High risk cardiovascular or respiratory discomfort detected. Please schedule an immediate consultation or visit an emergency room.'
    } else if (selectedSymptoms.some(s => ['Joint Pain'].includes(s))) {
      recommendedSpecialty = 'General physician'
      advice = 'Consider consulting a general physician to inspect joint issues. Rest the affected joint and apply cold compresses if inflamed.'
    } else if (Number(age) < 12 && Number(age) > 0) {
      recommendedSpecialty = 'Pediatricians'
      advice = 'Since the patient is a child, a consultation with a pediatrician is recommended for customized pediatric care and diagnostics.'
    } else if (selectedSymptoms.some(s => ['Headache', 'Dizziness'].includes(s)) && !selectedSymptoms.includes('Fever')) {
      recommendedSpecialty = 'Neurologist'
      advice = 'Consulting a neurologist is recommended for headaches or dizzy spells to rule out nerve or balance issues. Keep tracking migraine triggers.'
    }

    const tempNum = parseFloat(temperature)
    const hrNum = parseInt(heartRate)
    
    if (tempNum >= 102.5 || hrNum > 120 || selectedSymptoms.includes('Shortness of breath') || selectedSymptoms.includes('Chest tightness')) {
      severity = 'High'
      if (tempNum >= 102.5) {
        advice = 'High fever detected. Please consult a doctor immediately. Take paracetamol if prescribed, and use cool water compresses to reduce body heat.'
      }
    } else if (tempNum >= 100.4 || duration === 'More than 1 Week' || selectedSymptoms.length >= 4) {
      severity = 'Medium'
      if (advice.includes('mild')) {
        advice = 'Moderate symptoms detected. It is recommended to consult a specialist to prevent complications.'
      }
    }

    return { severity, recommendedSpecialty, advice }
  }

  const result = analyzeSymptoms()

  const handleNext = () => {
    if (step === 1) {
      if (!age) {
        toast.error('Please enter age')
        return
      }
      if (parseInt(age) <= 0 || parseInt(age) > 120) {
        toast.error('Please enter a valid age')
        return
      }
    }
    if (step === 2) {
      const tempNum = parseFloat(temperature)
      if (isNaN(tempNum) || tempNum < 90 || tempNum > 110) {
        toast.error('Please enter a valid body temperature (e.g. 97°F - 105°F)')
        return
      }
      const hrNum = parseInt(heartRate)
      if (isNaN(hrNum) || hrNum < 30 || hrNum > 220) {
        toast.error('Please enter a valid pulse rate (bpm)')
        return
      }
    }
    if (step === 3) {
      if (selectedSymptoms.length === 0) {
        toast.error('Please select at least one symptom')
        return
      }
    }
    setStep(prev => prev + 1)
  }

  const handlePrev = () => {
    setStep(prev => prev - 1)
  }

  const saveCheckupReport = async () => {
    if (!token) {
      toast.warn('Please login to save your health report')
      navigate('/login')
      return
    }

    setSaving(true)
    try {
      const payload = {
        age,
        gender,
        duration,
        temperature,
        heartRate,
        bloodPressure,
        symptoms: selectedSymptoms,
        severity: result.severity,
        recommendedSpecialty: result.recommendedSpecialty,
        advice: result.advice
      }

      const { data } = await axios.post(`${backendurl}/api/user/save-checkup`, payload, { headers: { token } })
      if (data.success) {
        toast.success('Report saved to profile successfully!')
        setSavedReportId(data.reportId)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to save checkup report')
    } finally {
      setSaving(false)
    }
  }

  const startNewCheckup = () => {
    setStep(1)
    setAge('')
    setGender('Male')
    setDuration('1-2 Days')
    setTemperature('98.6')
    setHeartRate('75')
    setBloodPressure('120/80')
    setSelectedSymptoms([])
    setSavedReportId(null)
  }

  return (
    <div className="py-6 sm:py-10 flex flex-col items-center w-full">
      <div className="text-center max-w-xl mb-8 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Smart Health <span className="text-primary">Symptom Checker</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Analyze your symptoms, log vitals, and get immediate guidance on which medical specialist to consult.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="w-full bg-gray-100 h-2 flex">
          <div className={`h-full bg-primary transition-all duration-300`} style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        <div className="px-5 sm:px-8 pt-6 pb-4 flex justify-between items-center border-b border-gray-100">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Step {step} of 4
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-800">
            {step === 1 && 'Basic Patient Info'}
            {step === 2 && 'Vitals Tracking'}
            {step === 3 && 'Select Symptoms'}
            {step === 4 && 'Analysis Results'}
          </span>
        </div>

        <div className="p-5 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Age</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="number"
                      placeholder="e.g. 28"
                      className="pl-10 border border-gray-300 rounded-xl w-full p-2.5 text-xs sm:text-sm outline-none focus:border-primary"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select 
                    className="border border-gray-300 rounded-xl w-full p-2.5 text-xs sm:text-sm outline-none focus:border-primary bg-white text-gray-800"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Symptom Duration</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['1-2 Days', '3-7 Days', 'More than 1 Week'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDuration(item)}
                      className={`py-3 px-4 border rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                        duration === item 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex gap-3 text-xs sm:text-sm text-blue-800">
                <BriefcaseMedical className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                <p>Entering accurate vitals allows the algorithm to estimate symptom severity much more effectively.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Body Temp (°F)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      className="pl-10 border border-gray-300 rounded-xl w-full p-2.5 text-xs sm:text-sm outline-none focus:border-primary"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="98.6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Pulse Rate (bpm)</label>
                  <div className="relative">
                    <Heart className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="number"
                      className="pl-10 border border-gray-300 rounded-xl w-full p-2.5 text-xs sm:text-sm outline-none focus:border-primary"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">BP (Sys/Dia)</label>
                  <div className="relative">
                    <Activity className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      className="pl-10 border border-gray-300 rounded-xl w-full p-2.5 text-xs sm:text-sm outline-none focus:border-primary"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      placeholder="120/80"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Select all symptoms you are currently experiencing:</p>
              
              <div className="flex flex-wrap gap-2 sm:gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {availableSymptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom.name)
                  return (
                    <button
                      key={symptom.name}
                      type="button"
                      onClick={() => toggleSymptom(symptom.name)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-full text-xs sm:text-sm font-semibold transition-all ${
                        isSelected 
                          ? 'bg-primary border-primary text-white shadow-md' 
                          : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-gray-400" />}
                      {symptom.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-200 bg-gray-50/60">
                <div className="flex items-center gap-3.5">
                  <div className={`p-3.5 rounded-full ${
                    result.severity === 'High' ? 'bg-red-100 text-red-600' :
                    result.severity === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">Symptom Severity</h3>
                    <p className="text-gray-500 text-xs">Based on your vitals & symptom inputs</p>
                  </div>
                </div>
                
                <span className={`text-sm sm:text-base font-extrabold uppercase px-5 py-1.5 rounded-full border shadow-sm ${
                  result.severity === 'High' ? 'bg-red-50 border-red-200 text-red-600' :
                  result.severity === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
                  'bg-green-50 border-green-200 text-green-600'
                }`}>
                  {result.severity} Risk
                </span>
              </div>

              <div className="border border-primary/20 bg-indigo-50/20 p-5 rounded-2xl flex flex-col sm:flex-row gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Recommended Specialist</h4>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{result.recommendedSpecialty}</p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed">{result.advice}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 border border-gray-200 rounded-2xl p-3.5 bg-gray-50/50 text-center text-xs">
                <div>
                  <p className="text-gray-400 text-[10px]">Temperature</p>
                  <p className="font-bold text-gray-800 text-xs sm:text-sm mt-0.5">{temperature}°F</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">Pulse Rate</p>
                  <p className="font-bold text-gray-800 text-xs sm:text-sm mt-0.5">{heartRate} bpm</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px]">Blood Pressure</p>
                  <p className="font-bold text-gray-800 text-xs sm:text-sm mt-0.5">{bloodPressure}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          {step > 1 && step < 4 && (
            <button 
              type="button" 
              onClick={handlePrev} 
              className="flex items-center gap-1 text-gray-600 hover:text-black font-semibold text-xs sm:text-sm transition"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step === 1 && <div></div>}

          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="bg-primary text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl hover:bg-primary/95 transition flex items-center gap-1 shadow-md"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row gap-2.5">
              <button 
                type="button"
                onClick={startNewCheckup}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition font-bold text-xs sm:text-sm"
              >
                Restart
              </button>

              {!savedReportId && (
                <button 
                  type="button"
                  onClick={saveCheckupReport}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-800 rounded-xl border hover:bg-gray-200 transition font-bold text-xs sm:text-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Report'}
                </button>
              )}

              <button 
                type="button"
                onClick={() => {
                  navigate(`/doctors/${result.recommendedSpecialty}`)
                  scrollTo(0,0)
                }}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/95 transition font-bold text-xs sm:text-sm shadow-md text-center flex items-center justify-center gap-1"
              >
                Book {result.recommendedSpecialty} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default OnlineCheckup
