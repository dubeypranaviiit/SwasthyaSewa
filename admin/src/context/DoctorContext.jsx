import axios from "axios";
import { createContext, useState } from "react"
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const token = localStorage.getItem('dToken');
    const [dToken, setDToken] = useState(token ? token : '');
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [appointments, setAppointments] = useState([])
    const [profileData, setProfileData] = useState(false)
    const [dashData, setDashData] = useState(false)

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
                console.log(`Doc Appointments :`, data);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(`Error :${error}`);
            toast.error(error.message)
        }
    }

    const getProfile = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            if (data.success) {
                setProfileData(data.profileData)
                console.log(`Doc Profile :`, data.profileData);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(`Error :${error}`);
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(`Doc DashData :`, data.dashData);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(`Error :${error}`);
            toast.error(error.message)
        }
    }

    const appointmentComplete = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData() // refresh dashboard as well
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const appointmentCancel = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData() // refresh dashboard
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateProfile = async (profileUpdateData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', profileUpdateData, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                setProfileData(data.profileData)
                getProfile()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(`Error :${error}`);
            toast.error(error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments, getAppointments,
        profileData, setProfileData, getProfile,
        dashData, setDashData, getDashData,
        appointmentCancel, appointmentComplete,
        updateProfile
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider



//  for login of and signup for admin