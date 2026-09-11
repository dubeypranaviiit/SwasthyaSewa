import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Stethoscope, Clock, AlertTriangle, UserCheck, Calendar, Phone, Droplet, X } from 'lucide-react'
import useSlotLock from '../hooks/useSlotLock'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendurl, getDoctorsData, token, userData, loadUserProfileData } = useContext(AppContext)
  const [docInfo, setDocInfo] = useState(null)

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [checkupHistory, setCheckupHistory] = useState([])
  const [selectedCheckup, setSelectedCheckup] = useState(null)
  const [consultationType, setConsultationType] = useState('offline')

  // Patient profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [patientGender, setPatientGender] = useState('')
  const [patientDob, setPatientDob] = useState('')
  const [patientBloodGroup, setPatientBloodGroup] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)

  const {
    heldSlot,
    isHolding,
    timeLeftFormatted,
    lockError,
    holdSlot,
    releaseSlot
  } = useSlotLock(backendurl, token)

  useEffect(() => {
    if (userData) {
      if (userData.gender && userData.gender !== 'Not Selected') {
        setPatientGender(userData.gender)
      } else {
        setPatientGender('')
      }
      if (userData.dob && userData.dob !== 'Not Selected' && userData.dob !== '0000-00-00') {
        setPatientDob(userData.dob)
      } else {
        setPatientDob('')
      }
      if (userData.bloodGroup && userData.bloodGroup !== 'Not Selected') {
        setPatientBloodGroup(userData.bloodGroup)
      }
      if (userData.phone && userData.phone !== '0000000000') {
        setPatientPhone(userData.phone)
      }
    }
  }, [userData, showProfileModal])

  const fetchCheckupHistory = async () => {
    try {
      const { data } = await axios.get(backendurl + '/api/user/checkups', { headers: { token } })
      if (data.success) {
        setCheckupHistory(data.checkups)
      }
    } catch (error) {
      console.log('Error fetching checkups:', error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCheckupHistory()
    }
  }, [token])

  const fetchDOcInfo = async () => {
    const docInfo = await doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        const slotDate = `${day}-${month}-${year}`
        const slotTime = formattedTime

        const isSlotAvailable = docInfo &&
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const handleSelectSlotTime = async (time) => {
    setSlotTime(time)
    if (!token || !docSlots[slotIndex] || !docSlots[slotIndex][0]) return
    const date = docSlots[slotIndex][0].datetime
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const slotDate = `${day}-${month}-${year}`

    const res = await holdSlot(docId, slotDate, time, 300)
    if (!res.success && res.status === 409) {
      toast.error('Slot currently held by another patient. Please choose another time.')
    }
  }

  const executeBooking = async (overrideData = {}) => {
    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      const slotDate = `${day}-${month}-${year}`

      const payload = {
        docId,
        slotDate,
        slotTime,
        checkupReport: selectedCheckup ? JSON.stringify(selectedCheckup) : null,
        consultationType,
        ...overrideData,
      }

      const { data } = await axios.post(
        backendurl + '/api/user/book-appointment',
        payload,
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        if (loadUserProfileData) loadUserProfileData()
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      const msg = error.response?.data?.message || error.message || 'Booking failed'
      toast.error(msg)
    }
  }

  const handleBookingClick = () => {
    if (!token) {
      toast.warn('Please log in to book an appointment')
      return navigate('/login')
    }
    if (!slotTime) {
      toast.warn('Please select a time slot')
      return
    }

    const hasGender = userData?.gender && userData.gender !== 'Not Selected' && userData.gender.trim() !== ''
    const hasDob = userData?.dob && userData.dob !== 'Not Selected' && userData.dob.trim() !== '' && userData.dob !== '0000-00-00'

    if (!hasGender || !hasDob) {
      setShowProfileModal(true)
      return
    }

    executeBooking()
  }

  const handleProfileSubmitAndBook = async (e) => {
    e.preventDefault()
    if (!patientGender || patientGender === 'Not Selected') {
      toast.warn('Please select your gender')
      return
    }
    if (!patientDob || patientDob === 'Not Selected') {
      toast.warn('Please provide your date of birth')
      return
    }

    try {
      setIsSubmittingProfile(true)
      const { data } = await axios.post(
        backendurl + '/api/user/update-profile',
        {
          name: userData?.name || 'User',
          phone: patientPhone || userData?.phone || '0000000000',
          gender: patientGender,
          dob: patientDob,
          bloodGroup: patientBloodGroup || userData?.bloodGroup || 'Not Selected',
        },
        { headers: { token } }
      )

      if (data.success) {
        if (loadUserProfileData) await loadUserProfileData()
        setShowProfileModal(false)
        await executeBooking({
          gender: patientGender,
          dob: patientDob,
          bloodGroup: patientBloodGroup || 'Not Selected',
          phone: patientPhone || userData?.phone || '0000000000',
        })
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Failed to update patient profile')
    } finally {
      setIsSubmittingProfile(false)
    }
  }

  useEffect(() => {
    fetchDOcInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  return docInfo && (
    <div className="py-6 sm:py-8 w-full">
      <div className='flex flex-col sm:flex-row gap-6 items-start'>
        <div className="w-full sm:w-64 md:w-72 flex-shrink-0">
          <img className="bg-primary/10 w-full h-64 sm:h-72 object-cover object-top rounded-2xl border border-gray-150 shadow-sm" src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className='flex-1 border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm w-full'>
          <p className='flex items-center gap-2 text-2xl font-bold text-gray-900'>
            {docInfo.name} 
            <img className='w-5 h-5' src={assets.verified_icon} alt='Verified'/>
          </p>

          <div className='flex items-center gap-2 text-xs sm:text-sm mt-1 text-gray-600 font-medium'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <span className='py-0.5 px-2.5 border border-gray-300 text-xs rounded-full bg-gray-50'>{docInfo.experience}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className='flex items-center gap-1.5 text-sm font-bold text-gray-800'>
              About <img className="w-3.5 h-3.5" src={assets.info_icon} alt="Info" />
            </p>
            <p className='text-xs sm:text-sm text-gray-600 max-w-2xl mt-1 leading-relaxed'>{docInfo.about}</p>
          </div>

          <p className='text-gray-700 font-bold mt-5 text-sm sm:text-base'>
            Appointment fee: <span className="text-primary font-extrabold ml-1">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      <div className='mt-8 pt-6 border-t border-gray-100 w-full'>
        <h3 className="font-bold text-lg text-gray-900">Booking Slots</h3>
        
        <div className='flex gap-3 items-center w-full overflow-x-auto no-scrollbar py-4'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div 
              onClick={() => setSlotIndex(index)} 
              className={`text-center py-4 min-w-[70px] rounded-2xl cursor-pointer transition-all duration-300 flex-shrink-0 ${
                slotIndex === index ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
              }`} 
              key={index}
            >
              <p className="text-xs font-semibold uppercase">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className="text-base font-extrabold mt-0.5">{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-2.5 w-full overflow-x-auto no-scrollbar py-2'>
          {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => handleSelectSlotTime(item.time)} 
              className={`text-xs font-semibold flex-shrink-0 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                item.time === slotTime ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30' : 'text-gray-600 border border-gray-200 bg-white hover:bg-gray-50'
              }`} 
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        {isHolding && (
          <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 text-primary px-4 py-2.5 rounded-xl text-xs font-semibold my-3 max-w-xl animate-fade-in">
            <Clock className="w-4 h-4 text-primary animate-pulse flex-shrink-0" />
            <span>Slot reserved for you: <strong className="font-bold text-indigo-700">{timeLeftFormatted}</strong> remaining to complete booking</span>
          </div>
        )}

        {lockError && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-xs font-semibold my-3 max-w-xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{lockError}</span>
          </div>
        )}

        {token && checkupHistory.length > 0 && (
          <div className='my-6 p-4 border border-indigo-150 bg-indigo-50/30 rounded-2xl max-w-xl'>
            <p className='text-xs sm:text-sm font-bold text-gray-800 mb-1 flex items-center gap-1.5'>
              <Stethoscope className="w-4 h-4 text-primary flex-shrink-0" /> Attach Online Checkup Report (Optional)
            </p>
            <p className='text-xs text-gray-500 mb-3'>
              Linking a report helps your doctor review your symptoms and vitals beforehand.
            </p>
            <select 
              className='w-full p-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white text-gray-700 outline-none focus:border-primary'
              onChange={(e) => {
                const id = e.target.value
                const report = checkupHistory.find(c => c._id === id)
                setSelectedCheckup(report || null)
              }}
              value={selectedCheckup?._id || ''}
            >
              <option value="">-- Select a Checkup Report --</option>
              {checkupHistory.map((report) => (
                <option key={report._id} value={report._id}>
                  Report from {new Date(report.date || report.createdAt).toLocaleDateString()} (Severity: {report.severity})
                </option>
              ))}
            </select>
            {selectedCheckup && (
              <div className='mt-3 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200 space-y-1'>
                <p><strong>Symptoms:</strong> {selectedCheckup.symptoms?.join(', ')}</p>
                <p><strong>Vitals:</strong> Temp: {selectedCheckup.temperature}°F | Pulse: {selectedCheckup.heartRate} bpm | BP: {selectedCheckup.bloodPressure}</p>
                <p><strong>Suggested Dept:</strong> {selectedCheckup.recommendedSpecialty}</p>
              </div>
            )}
          </div>
        )}

        <div className="my-6">
          <p className="text-sm font-bold text-gray-800 mb-3">Consultation Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div 
              onClick={() => setConsultationType('offline')}
              className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-3 ${
                consultationType === 'offline' 
                  ? 'border-primary bg-indigo-50/20 ring-2 ring-primary/10' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="p-2 bg-indigo-50 text-primary rounded-xl mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs sm:text-sm">Offline Clinic Visit</p>
                <p className="text-xs text-gray-500 mt-0.5">In-person checkup at the doctor's clinic</p>
                <p className="text-sm font-extrabold text-gray-900 mt-2">{currencySymbol}{docInfo.fees}</p>
              </div>
            </div>

            <div 
              onClick={() => setConsultationType('online')}
              className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-3 ${
                consultationType === 'online' 
                  ? 'border-primary bg-indigo-50/20 ring-2 ring-primary/10' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm">Online Video Consultation</p>
                  <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Video consultation via Stream.io</p>
                <p className="text-sm font-extrabold text-gray-900 mt-2">{currencySymbol}{Math.round(docInfo.fees * 0.8)} <span className="text-xs text-gray-400 line-through font-normal">{currencySymbol}{docInfo.fees}</span></p>
              </div>
            </div>
          </div>
          
          {consultationType === 'online' ? (
            <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Room access opens at the scheduled slot time or when your doctor begins the session.
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Clinic Address: {docInfo.address?.line1 || docInfo.address || 'Booty More'}, {docInfo.address?.line2 || 'Ranchi'}
            </p>
          )}
        </div>

        <button 
          onClick={handleBookingClick}
          className='w-full sm:w-auto bg-primary text-white text-xs sm:text-sm font-bold px-12 py-3.5 rounded-full my-4 shadow-lg hover:bg-opacity-95 active:scale-95 transition-all'
        >
          Book an appointment
        </button>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-primary">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">Patient Information</h3>
                  <p className="text-xs text-gray-500">Required for doctor consultation records</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmitAndBook} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPatientGender(g)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        patientGender === g
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  max={new Date().toISOString().split('T')[0]}
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-red-500" /> Blood Group
                  </label>
                  <select
                    value={patientBloodGroup}
                    onChange={(e) => setPatientBloodGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 focus:border-primary outline-none bg-white"
                  >
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-500" /> Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] text-gray-600 leading-relaxed">
                Your Age and Gender are shared securely with your consulting physician for accurate diagnoses and medical records.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-[#4351ea] text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmittingProfile ? 'Saving…' : 'Save & Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment