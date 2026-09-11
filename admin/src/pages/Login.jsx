import React, { useContext, useState } from 'react'
import { AdminContext } from "../context/AdminContext.jsx"
import { DoctorContext } from "../context/DoctorContext.jsx"
import axios from "axios"
import { toast } from "react-toastify"

const Login = () => {
  const [state, setState] = useState('Doctor')
  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  
  const [email, setEmail] = useState('doctor@gmail.com')
  const [password, setPassword] = useState('doctor123')
  const [isLoading, setIsLoading] = useState(false)

  const handleStateChange = (newState) => {
    setState(newState)
    if (newState === 'Doctor') {
      setEmail('doctor@gmail.com')
      setPassword('doctor123')
    } else {
      setEmail('')
      setPassword('')
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success("Welcome, Admin! Access granted.")
        } else {
          toast.error(data.message || "Invalid credentials. Please try again.")
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success("Welcome back, Doctor!")
        } else {
          toast.error(data.message || "Invalid credentials. Please try again.")
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || "Connection failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-56 sm:w-80 h-56 sm:h-80 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

      <form 
        onSubmit={onSubmitHandler} 
        className="w-full max-w-[420px] bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(95,111,255,0.08)] rounded-3xl p-5 sm:p-10 relative z-10 transition-all duration-300"
      >
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary flex items-center justify-center rounded-2xl shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 10.5V20a2 2 0 01-2 2H7a2 2 0 01-2-2v-9.5m14 0a2 2 0 00-2-2h-3a2 2 0 00-2 2v3m4-3a2 2 0 012 2v3m-8-3H7a2 2 0 00-2 2v3m0 0h14" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Swasthya<span className="text-primary">Sewa</span></span>
          </div>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400">Management & Staff Console</p>
        </div>

        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-full mb-4 relative border border-gray-200/40">
          <button 
            type="button"
            onClick={() => handleStateChange('Admin')}
            className={`flex-1 py-2 sm:py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 ${state === 'Admin' ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Admin Portal
          </button>
          <button 
            type="button"
            onClick={() => handleStateChange('Doctor')}
            className={`flex-1 py-2 sm:py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 ${state === 'Doctor' ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Doctor Portal
          </button>
          <div 
            className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-primary rounded-xl transition-transform duration-300 shadow-md shadow-primary/20 ${
              state === 'Doctor' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'
            }`}
          />
        </div>

        {/* Feature Check Callout - Shown only for Doctor */}
        {state === 'Doctor' && (
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 mb-5 flex items-start gap-2.5 text-left">
            <span className="text-base mt-0.5 flex-shrink-0">🔑</span>
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-bold text-amber-950">Password is given for feature check</p>
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                Doctor credentials are automatically pre-filled so you can explore the doctor portal features.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-5">
          <div className="w-full flex flex-col items-start">
            <label className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email Address</label>
            <div className="relative w-full mt-1.5">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input 
                type="email" 
                required
                placeholder={state === 'Doctor' ? 'doctor@gmail.com' : 'admin@swasthyasewa.com'}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm text-gray-800 font-medium placeholder-gray-400" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-start">
            <label className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</label>
            <div className="relative w-full mt-1.5">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm text-gray-800 font-medium placeholder-gray-400"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-[#4d5cf5] active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 mt-6 sm:mt-8 flex justify-center items-center gap-2 text-sm disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : `Sign In as ${state}`}
        </button>

        {state === 'Doctor' && (
          <p className="text-[11px] text-center text-gray-500 mt-3.5">
            Password is given for feature check • Click Sign In to test
          </p>
        )}
      </form>
    </div>
  )
}

export default Login