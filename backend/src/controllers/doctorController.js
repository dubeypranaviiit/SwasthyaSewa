import Appointment from "../models/appointment.models.js"
import doctorModel from "../models/doctor.models.js"
import { razorpayInstance } from "../config/razorpay.js"
const changeAvailablity =async (req,res)=>{
    try{
         const {docId} =req.body
         const docData= await doctorModel.findById(docId)
            await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
            res.status(200).json({
              success:true,
              message:`Availablity Changed`
            })
    }catch(error){
      res.status(500).json({
        success:false,
        message:error.message
      })
    }
}


const doctorList = async(req,res)=>{
  try{
    const doctors = await doctorModel.find({}).select(['-password','-email'])
      res.status(200).json({
        success:true,
        doctors
      })
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

const appointmentsDoctor = async(req,res)=>{
    try{
       const {docId} = req.body
       if(!docId){
        return res.status(400).json({
          success:false,
          message:'Doc id not found'
        })
       }
       const appointments = await Appointment.find({docId})
        res.status(200).json({
        success:true,
        message:'Successfully fetched appointments',
        appointments
      })
    }catch(error){
      console.log('Error in doc appointments',error);
      return res.status(500).json({

        success:false,
        message:'Something went wrtong while getting appointments'
      })
    }
}

const appointmentComplete = async(req,res)=>{
  try{
    const {docId,appointmentId} = req.body
    console.log(docId,appointmentId);
    const appointmentData = await Appointment.findById(appointmentId)
    console.log(`appointments  Data :${appointmentData}`);
    if(appointmentData && appointmentData.docId===docId){
       await Appointment.findByIdAndUpdate(appointmentId,{isCompleted:true},{new:true})
       return res.status(200).json({
        success:true,
        message:`Appointment Completed`
       })
    }else{
      return res.status(404).json({
        success:false,
        message:`Mark failed`
       })
    }
  }catch(error){
   console.log(`Error complete  appointments ${error}`);
   return res.status(500).json({
        success:false,
        message:`Something went wrong`
   })
  }
}
const appointmentCancel = async(req,res)=>{
  try{
    const {docId,appointmentId} = req.body
    const appointmentData = await Appointment.findById(appointmentId)
    
    if(!appointmentData) {
      return res.status(404).json({
        success:false,
        message:`Appointment not found`
      })
    }

    if(appointmentData.cancelled) {
      return res.status(400).json({
        success:false,
        message:`Appointment is already cancelled`
      })
    }

    if (appointmentData.isCompleted) {
      return res.status(400).json({
        success:false,
        message:`Cannot cancel a completed appointment`
      })
    }

    if(appointmentData.docId===docId){
       await Appointment.findByIdAndUpdate(appointmentId,{cancelled:true},{new:true})

       if (appointmentData.payment && appointmentData.paymentId) {
           try {
               await razorpayInstance.payments.refund(appointmentData.paymentId, {
                   amount: appointmentData.amount * 100,
                   speed: 'normal'
               })
           } catch (refundError) {
               console.error("Refund failed for paymentId:", appointmentData.paymentId, refundError.message)
           }
       }

       const {slotDate,slotTime} = appointmentData
       const doctorData = await doctorModel.findById(docId)
       if (doctorData && doctorData.slots_booked) {
           let slots_booked = doctorData.slots_booked
           if (slots_booked[slotDate]) {
               slots_booked[slotDate] = slots_booked[slotDate].filter( e=> e!==slotTime)
               await doctorModel.findByIdAndUpdate(docId,{slots_booked})
           }
       }

       return res.status(200).json({
        success:true,
        message:`Appointment Cancelled and Refund Initiated`
       })
    }else{
      return res.status(403).json({
        success:false,
        message:`Unauthorized action`
       })
    }
  }catch(error){
    console.log(`Error complete appointments ${error}`);
    return res.status(500).json({
         success:false,
         message:`Something went wrong`
    })
  }
}

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await Appointment.find({ docId })
        
        let earnings = 0
        appointments.forEach((item) => {
            if ((item.isCompleted || item.payment) && !item.cancelled) {
                earnings += item.amount
            }
        })

        const patientIds = appointments.map(item => item.userId.toString())
        const uniquePatients = [...new Set(patientIds)].length

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: uniquePatients,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.status(200).json({
            success: true,
            dashData
        })
    } catch (error) {
        console.error("Error in doctorDashboard:", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.status(200).json({
            success: true,
            profileData
        })
    } catch (error) {
        console.error("Error in doctorProfile:", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available, about } = req.body
        
        const updatedDoc = await doctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available,
            about
        }, { new: true }).select('-password')

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileData: updatedDoc
        })
    } catch (error) {
        console.error("Error in updateDoctorProfile:", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    changeAvailablity,
    doctorList,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}