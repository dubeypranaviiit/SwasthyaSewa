import mongoose from "mongoose"
import dotenv from  "dotenv"
dotenv.config();
const dbConnect =async()=>{
    await mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log(`MONGOdB connected successfully`);
    })
    .catch((error)=>{
        console.log(`Error while connecting database:${error}`);
    })
}

export  default dbConnect