import React, { createContext, useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
// // Create the AdminContext
export const AdminContext = createContext();

// AdminContextProvider component
const AdminContextProvider = (props) => {
    const token = localStorage.getItem('aToken');
    const [aToken, setAToken] = useState(token ? token :'');
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Retrieve backend URL from environment variables
   const [doctors,setDoctors] = useState([])
  const [appointments,setAppointments]= useState([])
     const [dashData,setDashData] = useState(false)
  const getAllDoctors =async()=>{
      try{
        const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{aToken}})
        if(data.success){
            setDoctors(data.doctors)
        }else{
            toast.error(data.message)
        }
      }catch(error){
        toast.error(error.message)
      }
 }

 const  changeAvailability =async (docId)=>{
      try{
   const {data} =await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{aToken}})
   if(data.success){
    toast.success(data.message);
    getAllDoctors()
   }else{
    ToastContainer.error(data.message)
   }
      }catch(error){
           toast.error(error.message)
      }
 }
   
 const getAllAppointments= async(req,res)=>{
    try{
      
        const {data}= await axios.get(backendUrl+`/api/admin/appointments`,{headers:{aToken}})
        console.log(`Appointments  data`,data.appointments);
      if(data.success){
        setAppointments(data.appointments)
      }else{
        toast.error(data.message)
      }
    }catch(error){
        console.log(error);
        toast.error(error.message)
    }
 }

 const cancelAppointment = async(appointmentId)=>{
  try{
    const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
     console.log(`Appointment Cancelled `,data);
    if(data.success){
      console.log(`Cancel Appointment`,data);
      toast.success(data.message)
      getAllAppointments()
    }else{
      toast.error(data.message)
    }
  
  }catch(error){
    console.log(error);
    toast.error(error.message)
  }
 }
 const getDashData= async()=>{
  try{
        const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})
          
        if(data.success){
          console.log(`DashBoarddata`,data);
          setDashData(data.dashData)
        }else{
          toast.error(data.message)
        }
      
      }catch(error){
        console.log(`error in dashData`,error);
        toast.error(data.message)
  }
 }
    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        getDashData,dashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children} {/* Render any children components */}
        </AdminContext.Provider>
    );
}

export default AdminContextProvider; // Export the provider for use in other components

