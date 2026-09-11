import userModel from "../models/user.models.js"
import {v2 as cloudinary} from "cloudinary"
import checkupModel from "../models/checkup.models.js"

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

const updateProfile =async (req,res)=>{


    try{
        const {userId,name,phone,address,dob,gender,bloodGroup,abhaNumber,height,weight,allergies} = req.body
        const imageFile =req.file
if(!name || !phone || !gender || !dob){
    return res.status(400).json({
        success:false,
        message:`Fill all data `
    })
}

await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender,bloodGroup,abhaNumber,height,weight,allergies})
    

if(imageFile){

    const imageUpload = await cloudinary.uploader.upload(req.file.path ,{
        folder:"Codehelp",
        public_id:`${req.file.name}`
    })
let imageUrl =imageUpload.secure_url 

await userModel.findByIdAndUpdate(userId,{image:imageUrl})
}

res.status(200).json({
    success:true,
    message:`Profile updated successfully`
})
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:`Server Error !please try agin later`
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
export {getProfile,updateProfile,saveCheckup,getCheckups}