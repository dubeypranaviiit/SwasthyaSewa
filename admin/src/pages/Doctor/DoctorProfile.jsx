import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorProfile = () => {
  const { dToken, profileData, getProfile, updateProfile } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [available, setAvailable] = useState(false)
  const [address, setAddress] = useState({ line1: '', line2: '' })

  useEffect(() => {
    if (dToken) {
      getProfile()
    }
  }, [dToken])

  useEffect(() => {
    if (profileData) {
      setFees(profileData.fees)
      setAbout(profileData.about)
      setAvailable(profileData.available)
      
      if (profileData.address) {
        if (typeof profileData.address === 'object') {
          setAddress({
            line1: profileData.address.line1 || '',
            line2: profileData.address.line2 || ''
          })
        } else {
          try {
            const parsed = JSON.parse(profileData.address)
            setAddress({
              line1: parsed.line1 || '',
              line2: parsed.line2 || ''
            })
          } catch (e) {
            setAddress({ line1: profileData.address, line2: '' })
          }
        }
      }
    }
  }, [profileData])

  const handleSave = async () => {
    await updateProfile({
      fees,
      about,
      available,
      address
    })
    setIsEdit(false)
  }

  return profileData && (
    <div className='w-full max-w-4xl space-y-4'>
      <h1 className='text-lg sm:text-xl font-bold text-gray-800'>Doctor Profile</h1>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 p-4 sm:p-8'>
        <div className='flex flex-col items-center md:items-start gap-4'>
          <img 
            className='w-32 h-32 sm:w-44 sm:h-44 rounded-2xl object-cover border-4 border-indigo-50 shadow-md bg-indigo-50/50' 
            src={profileData.image} 
            alt={profileData.name} 
          />
          
          <div className='flex items-center gap-2.5 bg-gray-50/80 px-3.5 py-2 rounded-xl border border-gray-100'>
            <input 
              type="checkbox" 
              id="available" 
              checked={available}
              disabled={!isEdit}
              onChange={(e) => setAvailable(e.target.checked)}
              className='w-4 h-4 text-primary accent-primary border-gray-300 rounded focus:ring-primary cursor-pointer disabled:opacity-75'
            />
            <label htmlFor="available" className='text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer select-none'>
              Available for Booking
            </label>
          </div>
        </div>

        <div className='flex-1 flex flex-col gap-4 sm:gap-5'>
          <div className='text-center md:text-left'>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>
              Dr. {profileData.name}
            </h1>
            <p className='text-xs sm:text-sm text-gray-500 font-medium mt-1'>
              {profileData.degree} - {profileData.speciality}
            </p>
            <div className='inline-block bg-indigo-50/70 border border-indigo-100 text-primary text-[11px] font-bold px-3 py-0.5 rounded-full mt-2 uppercase tracking-wide'>
              {profileData.experience} Experience
            </div>
          </div>

          <hr className='border-gray-100' />

          <div>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5'>About</h2>
            {isEdit ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className='w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all'
              />
            ) : (
              <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>{about}</p>
            )}
          </div>

          <div>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5'>Consultation Fees</h2>
            {isEdit ? (
              <div className='flex items-center gap-2 max-w-[180px]'>
                <span className='text-gray-500 font-bold text-sm'>{currency || '$'}</span>
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className='w-full border border-gray-200 rounded-xl p-2 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all'
                />
              </div>
            ) : (
              <p className='text-base font-bold text-gray-800'>
                {currency || '$'} {fees}
              </p>
            )}
          </div>

          <div>
            <h2 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5'>Clinic Address</h2>
            {isEdit ? (
              <div className='flex flex-col gap-2 max-w-md'>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className='border border-gray-200 rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all'
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  className='border border-gray-200 rounded-xl p-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all'
                />
              </div>
            ) : (
              <div className='text-xs sm:text-sm text-gray-600 font-medium'>
                <p>{address.line1}</p>
                <p className='mt-0.5'>{address.line2}</p>
              </div>
            )}
          </div>

          <hr className='border-gray-100 mt-1' />

          <div className='flex gap-3 justify-end pt-1'>
            {isEdit ? (
              <>
                <button
                  onClick={() => setIsEdit(false)}
                  className='px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className='px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-[#4d5cf5] text-white shadow-sm transition-all'
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className='px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-[#4d5cf5] text-white shadow-sm transition-all'
              >
                Edit Profile
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default DoctorProfile