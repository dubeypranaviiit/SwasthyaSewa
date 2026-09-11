import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import dbConnect from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js"
import videoRouter from "./routes/videoRoute.js"

const app = express();
dotenv.config({ path: './.env' });

const port = process.env.PORT || 6000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

dbConnect()
cloudinaryConnect()
    .then(() => console.log("Cloudinary connected successfully"))
    .catch((err) => {
        console.log(`Error connecting cloudinary: ${err}`);
    })

app.get('/', (req, res) => {
    res.json("API is working")
})
app.use("/api/admin", adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/video', videoRouter)

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on Port: ${port}`);
    })
}

export default app