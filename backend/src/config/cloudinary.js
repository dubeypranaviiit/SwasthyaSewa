import {v2 as cloudinary} from "cloudinary"
import dotenv from 'dotenv';
dotenv.config();
const cloudinaryConnect = async () => {
    console.log(process.env.CLOUDINARY_NAME)
    try{
            cloudinary.config({
                cloud_name:process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            })
            console.log('Cloudinary configuration successful');
    }
    catch(error) {
        console.error('Error configuring Cloudinary:', error);
    }  
}
export default cloudinaryConnect