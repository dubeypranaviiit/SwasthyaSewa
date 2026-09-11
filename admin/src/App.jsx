import { useContext, useState, useEffect } from "react";
import Login from "./pages/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AdminContext} from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";

const App = ()=> {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD] min-h-screen flex flex-col w-full overflow-x-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="flex flex-1 items-start relative min-w-0 w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 w-full p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<></>}></Route>
            <Route path="/admin-dashboard" element={<Dashboard/>}></Route>
            <Route path="/all-appointments" element={<AllAppointments />}></Route>
            <Route path="/add-doctor" element={<AddDoctor />}></Route>
            <Route path="/doctor-list" element={<DoctorList />}></Route>

            <Route path="/doctor-dashboard" element={<DoctorDashboard/>}></Route>
            <Route path="/doctor-appointments" element={<DoctorAppointments />}></Route>
            <Route path="/doctor-profile" element={<DoctorProfile/>}></Route>
          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
