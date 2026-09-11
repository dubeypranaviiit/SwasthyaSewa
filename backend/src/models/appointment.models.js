import mongoose from "mongoose"
import { Schema } from "mongoose"

const appointmentSchema = new mongoose.Schema({
           
    userId:{
        type:String,
        required:true
    },
    docId:{
        type:String,
        required:true
    },
    slotDate:{
        type:String,
        required:true
    },
    slotTime:{
        type:String,
        required:true
    },
    userData:{
        type:Object,
        required:true
    },
    docData:{
        type:Object,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Number,
        required:true
    },
    cancelled:{
        type:Boolean,
        default:false
    },
    payment:{
        type:Boolean,
        default:false
    },
    paymentId:{
        type:String,
        default:null
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    checkupReport:{
        type:Object,
        default:null
    },
    consultationType:{
        type:String,
        enum:['online','offline'],
        default:'offline'
    },
    videoCallId:{
        type:String,
        default:null
    },
    videoCallLink:{
        type:String,
        default:null
    },
    videoCallStatus:{
        type:String,
        enum:['pending','active','ended'],
        default:'pending'
    },
    refundId:{
        type:String,
        default:null
    },
    refundStatus:{
        type:String,
        enum:['none','initiated','processed','failed'],
        default:'none'
    },
    refundAmount:{
        type:Number,
        default:0
    },
    prescription: {
        diagnosis: { type: String, default: "" },
        symptoms: [{ type: String }],
        vitals: {
            bp: { type: String, default: "" },
            pulse: { type: String, default: "" },
            temperature: { type: String, default: "" },
            weight: { type: String, default: "" }
        },
        medicines: [
            {
                name: { type: String, required: true },
                dosage: { type: String, default: "1 Tab" },
                frequency: { type: String, default: "1-0-1" },
                duration: { type: String, default: "5 Days" },
                timing: { type: String, default: "After Food" },
                quantity: { type: Number, default: 10 }
            }
        ],
        advice: { type: String, default: "" },
        labTests: { type: String, default: "" },
        nextFollowUpDate: { type: String, default: "" },
        prescribedAt: { type: Date, default: null }
    }

})
const Appointment = mongoose.model("Appointment",appointmentSchema)
export default Appointment