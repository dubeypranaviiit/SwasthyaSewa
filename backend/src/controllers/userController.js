import userModel from "../models/user.models.js"
import {v2 as cloudinary} from "cloudinary"
import checkupModel from "../models/checkup.models.js"
import Appointment from "../models/appointment.models.js"
import doctorModel from "../models/doctor.models.js"

const getProfile = async(req,res)=>{
    try{
          const {userId} = req.body
          const userData = await userModel.findById(userId).select('-password')
          res.status(200).json({
            success:true,
            userData
          })
    }catch(error){
             console.log(error);
             res.status(500).json({
                success:false,
                message:error.message
             })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender, bloodGroup, abhaNumber, height, weight, allergies } = req.body
        const imageFile = req.file

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let parsedAddress = user.address
        if (address) {
            try {
                parsedAddress = typeof address === 'string' ? JSON.parse(address) : address
            } catch (e) {
                parsedAddress = user.address
            }
        }

        const updateData = {
            name: name || user.name,
            phone: phone || user.phone,
            dob: dob || user.dob,
            gender: gender || user.gender,
            bloodGroup: bloodGroup !== undefined ? bloodGroup : user.bloodGroup,
            abhaNumber: abhaNumber !== undefined ? abhaNumber : user.abhaNumber,
            height: height !== undefined ? height : user.height,
            weight: weight !== undefined ? weight : user.weight,
            allergies: allergies !== undefined ? allergies : user.allergies,
            address: parsedAddress,
        }

        await userModel.findByIdAndUpdate(userId, updateData)

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                folder: "Codehelp",
                public_id: `${req.file.name}`
            })
            let imageUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error! Please try again later"
        })
    }
}
const saveCheckup = async (req, res) => {
    try {
        const { userId, age, gender, duration, temperature, heartRate, bloodPressure, symptoms, severity, recommendedSpecialty, advice } = req.body
        if (!userId || !age || !gender || !duration || !temperature || !heartRate || !bloodPressure || !symptoms || !severity || !recommendedSpecialty || !advice) {
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            })
        }

        const newCheckup = new checkupModel({
            userId,
            age,
            gender,
            duration,
            temperature,
            heartRate,
            bloodPressure,
            symptoms,
            severity,
            recommendedSpecialty,
            advice
        })

        const saved = await newCheckup.save()

        res.status(200).json({
            success: true,
            message: "Report saved successfully",
            reportId: saved._id
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCheckups = async (req, res) => {
    try {
        const { userId } = req.body
        const checkups = await checkupModel.find({ userId }).sort({ date: -1 })
        res.status(200).json({
            success: true,
            checkups
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getMedicalHistory = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await Appointment.find({
            userId,
            cancelled: false,
            $or: [
                { prescription: { $exists: true, $ne: null } },
                { checkupReport: { $exists: true, $ne: null } },
                { isCompleted: true }
            ]
        }).sort({ date: -1 }).lean()

        const enrichedHistory = await Promise.all(
            appointments.map(async (item) => {
                let doc = item.docData
                if (typeof doc === 'string') {
                    try { doc = JSON.parse(doc) } catch (e) { doc = null }
                }
                if (!doc || !doc.name || !doc.image) {
                    const freshDoc = await doctorModel.findById(item.docId).select("-password -slots_booked").lean()
                    if (freshDoc) doc = freshDoc
                }
                return {
                    ...item,
                    docData: doc || item.docData || {}
                }
            })
        )

        res.status(200).json({
            success: true,
            history: enrichedHistory
        })
    } catch (error) {
        console.error("Error in getMedicalHistory:", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { getProfile, updateProfile, saveCheckup, getCheckups, getMedicalHistory }