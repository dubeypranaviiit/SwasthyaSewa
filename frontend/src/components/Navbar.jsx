import React, { useContext, useState } from 'react'
import { assets } from "../assets/assets_frontend/assets"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = async () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-6 border-b border-gray-200 w-full relative z-40'>
      <h1 onClick={() => navigate('/')} className='text-2xl sm:text-3xl font-extrabold cursor-pointer text-gray-900 tracking-tight flex items-center gap-1'>
        Swasthya<span className='text-primary'>Sewa</span>
      </h1>

      <ul className='hidden md:flex items-center gap-4 lg:gap-7 font-semibold text-gray-700 text-xs lg:text-sm'>
        <NavLink to="/" className={({ isActive }) => `py-1 transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>
          <li>HOME</li>
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => `py-1 transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/ai-health-check" className={({ isActive }) => `py-1 transition-colors ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`}>
          <li>AI HEALTH CHECK</li>
        </NavLink>
        <NavLink to="/online-checkup" className={({ isActive }) => `py-1 transition-colors ${isActive ? 'text-primary font-bold' : 'text-primary hover:text-opacity-80'}`}>
          <li>ONLINE CHECKUP</li>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `py-1 transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `py-1 transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className='flex items-center gap-3 sm:gap-4'>
        {token && userData ? (
          <div className='flex items-center gap-2 cursor-pointer group relative py-1'> 
            <img className="w-8 h-8 rounded-full object-cover border border-gray-200" src={userData.image} alt="Profile" />
            <img className='w-2.5 transition-transform group-hover:rotate-180' src={assets.dropdown_icon} alt="Dropdown" />
            
            <div className='absolute top-full right-0 pt-2 text-sm font-medium text-gray-600 z-50 hidden group-hover:block'>
              <div className='min-w-48 bg-white border border-gray-150 rounded-2xl shadow-xl flex flex-col gap-3 p-4'>
                <p onClick={() => navigate('/MyProfile')} className='hover:text-primary cursor-pointer transition-colors'>My Profile</p>
                <p onClick={() => navigate('/my-appointment')} className='hover:text-primary cursor-pointer transition-colors'>My Appointments</p>
                <p onClick={() => navigate('/medical-history')} className='hover:text-primary cursor-pointer transition-colors'>Medical History</p>
                <div className="h-px bg-gray-100 my-0.5"></div>
                <p onClick={logout} className='hover:text-red-600 text-red-500 font-semibold cursor-pointer transition-colors'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-primary text-white px-6 lg:px-8 py-2.5 rounded-full font-semibold hidden md:block hover:bg-opacity-95 shadow-md active:scale-95 transition-all text-xs lg:text-sm'>
            Create Account
          </button>
        )}

        <img onClick={() => setShowMenu(true)} className='w-6 h-6 md:hidden cursor-pointer hover:opacity-80 transition' src={assets.menu_icon} alt="Menu" />
        
        {showMenu && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden" onClick={() => setShowMenu(false)}></div>
        )}

        <div className={`fixed top-0 right-0 bottom-0 z-50 bg-white w-[280px] sm:w-[320px] shadow-2xl transition-transform duration-300 transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col justify-between`}>
          <div>
            <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Swasthya<span className="text-primary">Sewa</span></span>
              <img className='w-6 h-6 cursor-pointer hover:opacity-80 transition' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close Menu" />
            </div>
            
            <ul className='flex flex-col gap-2 mt-4 px-6 text-sm font-semibold text-gray-700'>
              <NavLink onClick={() => setShowMenu(false)} to='/' className="py-2.5 border-b border-gray-50">
                <p className='hover:text-primary transition-all'>Home</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors' className="py-2.5 border-b border-gray-50">
                <p className='hover:text-primary transition-all'>ALL DOCTORS</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/ai-health-check' className="py-2.5 border-b border-gray-50">
                <p className='hover:text-primary transition-all font-bold text-primary'>AI HEALTH CHECK</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/online-checkup' className="py-2.5 border-b border-gray-50">
                <p className='text-primary font-bold hover:text-opacity-80 transition-all'>ONLINE CHECKUP</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about' className="py-2.5 border-b border-gray-50">
                <p className='hover:text-primary transition-all'>ABOUT</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact' className="py-2.5 border-b border-gray-50">
                <p className='hover:text-primary transition-all'>CONTACT</p>
              </NavLink>

              {token && (
                <>
                  <NavLink onClick={() => setShowMenu(false)} to='/MyProfile' className="py-2.5 border-b border-gray-50">
                    <p className='hover:text-primary transition-all'>My Profile</p>
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/my-appointment' className="py-2.5 border-b border-gray-50">
                    <p className='hover:text-primary transition-all'>My Appointments</p>
                  </NavLink>
                  <NavLink onClick={() => setShowMenu(false)} to='/medical-history' className="py-2.5 border-b border-gray-50">
                    <p className='hover:text-primary transition-all'>Medical History</p>
                  </NavLink>
                </>
              )}

              <a
                href={adminUrl}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => setShowMenu(false)}
                className="py-2.5 border-b border-gray-50 flex items-center justify-between text-gray-700 hover:text-primary font-semibold transition-all group"
              >
                <span>Doctor / Admin Portal</span>
                <span className="text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            </ul>
          </div>

          <div className="p-6 border-t border-gray-100">
            {token ? (
              <button onClick={() => { setShowMenu(false); logout(); }} className="w-full text-center py-3 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-all text-sm">
                Logout
              </button>
            ) : (
              <button onClick={() => { setShowMenu(false); navigate('/login'); }} className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-opacity-95 transition-all">
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar