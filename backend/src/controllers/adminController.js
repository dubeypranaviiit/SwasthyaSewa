import validator from "validator"
import bcryptjs from "bcryptjs"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctor.models.js"
import fs from "fs"
import Appointment from "../models/appointment.models.js"
import userModel from "../models/user.models.js"
import { razorpayInstance } from "../config/razorpay.js"

const addDoctor = async(req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address} =req.body
        const imageFile= req.file

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please Enter a valid email",
            })
        }

        let existingDoc = await doctorModel.findOne({email})
        console.log(existingDoc);
        if(existingDoc){
            return res.status(500).json({
                success:false,
                message:`User exist with this email`
            })
        }
        
        if(password.length<8){
            return res.status(400).json({
                success: false,
                message: "Please Enter a strong password ",
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)

        let imageUrl
        try{
            const imageUpload = await cloudinary.uploader.upload(req.file.path ,{
                folder:"Codehelp",
                public_id:`${req.file.name}`
            })
            imageUrl = imageUpload.secure_url 
        }catch(err){
            return res.status(503).json({
                message:`Error cloud ${err}`,
                success:false
            })
        }

        let doctorData = {
            name,
            email,
            password:hashedPassword,
            image:imageUrl,
            speciality,
            degree,
            experience,
            about,
            available: true,
            fees,
            address,
            date:Date.now()
        };
        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save();

        fs.unlinkSync(req.file.path);
        res.status(200).json({
            success:true,
            message:"Doctor added Successfully"
        })
    }catch(err){
        console.log(`Error in saving data: ${err}`);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the doctor",
            error: err.message
        });
    }
}

const adminLogin = async(req,res)=>{
    try{
        const {email,password}= req.body
        if( !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill all data carefully ",
            })
        }
        let hashed
        if(email===process.env.ADMIN_EMAIL && password === ADMIN_PASSWORD) {

        }else{
            return res.status(400).json({
                success: false,
                message: "Incorrect Password or Email",
            })
        }

        if(password.length<8){
            return res.status(400).json({
                success: false,
                message: "Please Enter a strong password ",
            })
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: "An error occurred while creating admin api in admin controller",
            error: error.message
        });
    }
}

const allDoctors = async(req,res)=>{
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.status(200).json({
            success:true,
            doctors
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:`Server Error`
        })
    }
}

const appointmentsAdmin = async(req,res)=>{
    try{
        const appointments = await Appointment.find({})
        res.status(200).json({
            success:true,
            message:`Successfully fetched`,
            appointments
        })
    }catch(error){
        return res.status(500).json({
            sucess:false,
            message:`Something went wrong in fetching all the appointments `
        })
    }
}

const cancelAppointment = async(req,res)=>{
    try{
        const {appointmentId} =req.body
        const appointmentData = await Appointment.findById(appointmentId)
  
        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }

        if (appointmentData.cancelled) {
            return res.status(400).json({
                success: false,
                message: "Appointment already cancelled"
            })
        }

        if (appointmentData.isCompleted) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a completed appointment"
            })
        }

        await Appointment.findByIdAndUpdate(appointmentId,{cancelled:true})
        
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

        const {docId,slotDate,slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)
        if (doctorData && doctorData.slots_booked) {
            let slots_booked = doctorData.slots_booked
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
                await doctorModel.findByIdAndUpdate(docId,{slots_booked})
            }
        }
        
        console.log(`Appointment Cancelled by admin`);
        res.json({success:true,message:"Appointment Cancelled and Refund Initiated"})
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Server Error ! Please try again later'
        })
    }
}

const adminDashboard = async(req,res)=>{
    try{
        const doctors = await doctorModel.find({});
        const users = await userModel.find({})
        const appointments = await Appointment.find({})
        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            lastestAppointments:appointments.reverse().slice(0,5)
        }
        res.status(200).json({
            success:true,
            message:`Successfully fetched`,
            dashData
        })
    }catch(error){
        console.log('Error in dashData',error);
        return res.status(500).json({
            success:false,
            message:`Something went wrong while finding doc dashboard`
        })
    }
}

export {addDoctor,allDoctors,appointmentsAdmin,cancelAppointment,adminDashboard}