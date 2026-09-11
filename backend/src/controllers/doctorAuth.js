import doctorModel from "../models/doctor.models.js"
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const loginDoctors = async(req,res)=>{
    try{
        const {email,password} =req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:`Please fill necessary field `
            })
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:`Wrong email id `
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success:false,
                message:`Enter a strong password`
            })
        }

        const user = await doctorModel.findOne({email})
        if(!user){
            return res.status(500).json({
                success:false,
                message:`User not found`
            })
        }

        const IsMatch = await bcrypt.compare(password,user.password)
        if (IsMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000
            });
            res.status(200).json({
                success:true,
                token,
            }) 
        }else{
            res.json({
                success:false,
                message:`Enter a valid email id`
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Please try again later'
        })
    }
}

export {loginDoctors}