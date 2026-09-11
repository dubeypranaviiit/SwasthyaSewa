import { createContext } from "react";

export const AppContext = createContext()


const AppContextProvider =(props)=>{
    const currency =`₹`
    const calculateAge = (dob) => {
        if (!dob || dob === 'Not Selected') return 'N/A'
        const birthDate = new Date(dob)
        if (isNaN(birthDate.getTime())) return 'N/A'
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age >= 0 ? age : 'N/A'
    }
    const value ={
        calculateAge,
        currency
    }

    return (
        <AppContext.Provider value ={value}>
            {
                props.children
            }
        </AppContext.Provider>
    )
}

export default AppContextProvider