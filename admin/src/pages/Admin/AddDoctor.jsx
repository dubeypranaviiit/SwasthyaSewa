import React, { useContext, useState } from 'react'
import { assets_admin } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    
    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (!docImg) {
                return toast.error('Profile picture not selected')
            }
            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({
                line1: address1,
                line2: address2
            }))

            const data = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.data.success) {
                toast.success(data.data.message)
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setAddress1('')
                setAddress2('')
                setFees('')
                setDegree('')
                setAbout('')
            } else {
                toast.error(data.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <form onSubmit={onSubmitHandler} className='w-full max-w-4xl space-y-4'>
      <h1 className='text-lg sm:text-xl font-bold text-gray-800'>Add Doctor</h1>
      
      <div className='bg-white p-4 sm:p-8 border border-gray-100 rounded-2xl shadow-sm w-full space-y-6'>
         <div className='flex items-center gap-4 text-gray-500 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200'>
          <label htmlFor="doc-img" className='relative cursor-pointer group'>
              <img 
                className='w-16 h-16 object-cover bg-gray-100 rounded-full border-2 border-indigo-50 shadow-xs group-hover:opacity-80 transition'
                src={docImg ? URL.createObjectURL(docImg) : assets_admin.upload_area} 
                alt="Upload doctor picture" 
              />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id='doc-img'
            accept="image/*"
            hidden 
          />
          <div>
            <p className='text-sm font-semibold text-gray-700'>Upload Doctor Picture</p>
            <p className='text-xs text-gray-400 mt-0.5'>PNG, JPG or WEBP (Max 5MB)</p>
          </div>
         </div>

         <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-10 text-gray-600 text-sm font-medium'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Doctor Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
                type="text" 
                placeholder='Dr. John Doe' 
                required
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Doctor Email</label>
              <input 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all'  
                type="email" 
                placeholder='doctor@swasthyasewa.com' 
                required
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
                type="password" 
                placeholder='Set account password' 
                required
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Experience</label>
              <select 
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer'
              >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Year">2 Year</option>
                  <option value="3 Year">3 Year</option>
                  <option value="4 Year">4 Year</option>
                  <option value="5 Year">5 Year</option>
                  <option value="6 Year">6 Year</option>
                  <option value="7 Year">7 Year</option>
                  <option value="8 Year">8 Year</option>
                  <option value="9 Year">9 Year</option>
                  <option value="10 Year">10 Year</option>
                  <option value="More than 10 Year">More than 10 Year</option>
              </select>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Consultation Fees</label>
              <input 
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
                type="number" 
                placeholder='Fees amount' 
                required
              />
            </div>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Speciality</label>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer'
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Education</label>
              <input 
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
                type="text" 
                placeholder='Degrees (e.g. MBBS, MD)' 
                required
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Clinic Address</label>
              <div className="space-y-2">
                <input
                  onChange={(e) => setAddress1(e.target.value)}
                  value={address1}
                  className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
                  type="text" 
                  placeholder='Address Line 1' 
                  required
                />
                <input
                  onChange={(e) => setAddress2(e.target.value)}
                  value={address2}
                  className='w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
                  type="text" 
                  placeholder='Address Line 2' 
                  required
                />
              </div>
            </div>
          </div>
         </div>

         <div className='flex flex-col gap-1.5'>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">About Doctor</label>
            <textarea
              onChange={(e) => setAbout(e.target.value)}
              value={about} 
              className='w-full border border-gray-200 rounded-xl p-3.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all' 
              placeholder='Write a short professional summary about the doctor' 
              rows={4} 
              required
            />
         </div>

         <div className='pt-2 flex justify-start sm:justify-end'>
           <button 
             type='submit'
             className='w-full sm:w-auto bg-primary hover:bg-[#4d5cf5] active:scale-95 text-white font-bold px-10 py-3 rounded-xl shadow-md shadow-primary/20 transition-all text-sm'
           >
             Add Doctor
           </button>
         </div>
      </div>
    </form>
  )
}

export default AddDoctor