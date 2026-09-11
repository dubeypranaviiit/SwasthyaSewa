import mongoose from "mongoose"

const checkupSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    temperature: {
        type: String,
        required: true
    },
    heartRate: {
        type: String,
        required: true
    },
    bloodPressure: {
        type: String,
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    recommendedSpecialty: {
        type: String,
        required: true
    },
    advice: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        default: Date.now
    }
}, { timestamps: true })

const checkupModel = mongoose.models.checkup || mongoose.model("checkup", checkupSchema)
export default checkupModel
