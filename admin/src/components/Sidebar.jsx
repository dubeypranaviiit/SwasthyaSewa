import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { NavLink } from 'react-router-dom'
import { assets_admin } from '../assets/assets_admin/assets'

const Sidebar = ({ isOpen, onClose }) => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    const linkClasses = ({ isActive }) => 
      `flex items-center gap-3.5 py-3.5 px-5 md:px-7 cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`

    const navContent = (
      <div className="py-4">
        {aToken && (
          <ul className='flex flex-col gap-1'>
            <NavLink className={linkClasses} to={'/admin-dashboard'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.home_icon} alt="Dashboard" />
              <p className='font-medium text-sm'>Dashboard</p>
            </NavLink>
            <NavLink className={linkClasses} to={'/all-appointments'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.appointment_icon} alt="Appointments" />
              <p className='font-medium text-sm'>Appointments</p>
            </NavLink>
            <NavLink className={linkClasses} to={'/add-doctor'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.add_icon} alt="Add Doctor" />
              <p className='font-medium text-sm'>Add Doctor</p>
            </NavLink>
            <NavLink className={linkClasses} to={'/doctor-list'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.people_icon} alt="Doctors List" />
              <p className='font-medium text-sm'>Doctors List</p>
            </NavLink>
          </ul>
        )}

        {dToken && (
          <ul className='flex flex-col gap-1'>
            <NavLink className={linkClasses} to={'/doctor-dashboard'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.home_icon} alt="Dashboard" />
              <p className='font-medium text-sm'>Dashboard</p>
            </NavLink>
            <NavLink className={linkClasses} to={'/doctor-appointments'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.appointment_icon} alt="Appointments" />
              <p className='font-medium text-sm'>Appointments</p>
            </NavLink>
            <NavLink className={linkClasses} to={'/doctor-profile'} onClick={onClose}>
              <img className='w-5 h-5 min-w-[20px]' src={assets_admin.people_icon} alt="Profile" />
              <p className='font-medium text-sm'>Profile</p>
            </NavLink>
          </ul>
        )}
      </div>
    )

    return (
      <>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="text-base font-bold text-gray-800">Navigation Menu</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Close navigation sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {navContent}
        </aside>

        <aside className='hidden md:block bg-white border-r w-16 lg:w-64 min-h-[calc(100vh-65px)] flex-shrink-0 transition-all duration-300'>
          <div className="hidden lg:block">
            {navContent}
          </div>
          <div className="block lg:hidden py-4">
            {aToken && (
              <ul className='flex flex-col gap-1 items-center'>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/admin-dashboard'} title="Dashboard">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.home_icon} alt="Dashboard" />
                </NavLink>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/all-appointments'} title="Appointments">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.appointment_icon} alt="Appointments" />
                </NavLink>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/add-doctor'} title="Add Doctor">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.add_icon} alt="Add Doctor" />
                </NavLink>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/doctor-list'} title="Doctors List">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.people_icon} alt="Doctors List" />
                </NavLink>
              </ul>
            )}
            {dToken && (
              <ul className='flex flex-col gap-1 items-center'>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/doctor-dashboard'} title="Dashboard">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.home_icon} alt="Dashboard" />
                </NavLink>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/doctor-appointments'} title="Appointments">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.appointment_icon} alt="Appointments" />
                </NavLink>
                <NavLink 
                  className={({isActive}) => `p-3.5 rounded-xl transition-all ${isActive ? 'bg-[#F2F3FF] text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                  to={'/doctor-profile'} title="Profile">
                  <img className='w-5 h-5 min-w-[20px]' src={assets_admin.people_icon} alt="Profile" />
                </NavLink>
              </ul>
            )}
          </div>
        </aside>
      </>
    )
}

export default Sidebar