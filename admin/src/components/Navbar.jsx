import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ onToggleSidebar }) => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate()

  const logout = () => {
    navigate("/")
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
    }
  }

  return (
    <div className='sticky top-0 z-30 flex justify-between items-center px-3 sm:px-8 py-3 border-b bg-white/95 backdrop-blur-md shadow-xs'>
      <div className='flex items-center gap-2 sm:gap-3 text-xs'>
        <button
          onClick={onToggleSidebar}
          className='md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors'
          aria-label="Toggle navigation sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 
          onClick={() => navigate('/')} 
          className='text-lg sm:text-2xl font-black cursor-pointer text-gray-900 tracking-tight flex items-center gap-1'
        >
          Swasthya<span className='text-primary'>Sewa</span>
        </h1>
        <p className='border px-2 sm:px-2.5 py-0.5 rounded-full border-gray-400 text-gray-600 text-[10px] sm:text-xs font-semibold'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      <button 
        className='bg-primary hover:bg-[#4d5cf5] active:scale-95 text-white text-xs sm:text-sm font-semibold px-4 sm:px-8 py-1.5 sm:py-2 rounded-full transition-all shadow-sm' 
        onClick={logout}
      >
        Logout
      </button>  
    </div>
  )
}

export default Navbar