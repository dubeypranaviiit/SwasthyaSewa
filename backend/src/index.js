import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import dbConnect from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js"
import { initRedis } from "./config/redis.js"
import { globalLimiter, initRateLimiters } from "./middleware/rateLimiter.js"
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js"
import videoRouter from "./routes/videoRoute.js"

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 6000

app.set('trust proxy', 1)

app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cors())

app.use('/api', globalLimiter)

try {
    await initRedis();
    initRateLimiters();
} catch (err) {
    console.error(`[Redis] Initialization failed: ${err.message}`);
    initRateLimiters();
}

dbConnect()
cloudinaryConnect()
    .then(() => console.log("Cloudinary connected successfully"))
    .catch((err) => {
        console.log(`Error connecting cloudinary: ${err}`);
    })

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString()
    })
})

app.get('/', (req, res) => {
    res.json("API is working")
})
app.use("/api/admin", adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/video', videoRouter)

app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
})

export default app