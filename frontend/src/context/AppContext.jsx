import { createContext, useEffect, useState } from "react";

export const AppContext =createContext();
import axios from "axios"
import {toast} from "react-toastify"
const AppContextProvider =(props)=>{
  const currencySymbol ='₹'

const backendurl = import.meta.env.VITE_BACKEND_URL
console.log(backendurl +'/api/user/login') 
const [doctors,setDoctors] = useState([])
const atoken =localStorage.getItem('token')
 const [token,setToken]=useState(atoken ?atoken : '')
 const [userData,setUserData] = useState(false)
const loadUserProfileData= async()=>{
    try{
              const {data} = await axios.get(backendurl +'/api/user/profile',{headers:{token}})
             if(data.success){
                setUserData(data.userData)
             }else{
                toast.error(data.message)
             }
    }catch(error){
        console.log(error);
        toast.error(error.message)
    }
}
 const getDoctorsData = async ()=>{
    try{
        const {data} = await axios.get(backendurl+'/api/doctor/list')
        if(data.success){
            setDoctors(data.doctors)

        }else{
            toast.error(data.message)
        }
    }catch(error){
         console.log(error);
        toast.error(error.message)
    }
 }

 useEffect(()=>{
  getDoctorsData()
 },[])
 useEffect(()=>{
    if(token){
        loadUserProfileData()
    }else{
        setUserData(false)
    }
 
   },[token])
   const value ={
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendurl,
     userData,setUserData,loadUserProfileData
}

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
 }

 export default AppContextProvider