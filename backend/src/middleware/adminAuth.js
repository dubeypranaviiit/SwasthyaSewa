import jwt from "jsonwebtoken"

const authAdmin =async(req,res,next)=>{
try{
const {atoken} =req.headers
 if(!atoken){
    return res.status(400).json({
        success: false,
        message: "Invalid credential as admin",
})
 }
 const token_decode =jwt.verify(atoken,process.env.JWT_SECRET)

 if(token_decode !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD)
    return res.status(400).json({
        success: false,
        message: "Invalid credential ",
})
 next()
}catch(error){
return res.status(400).json({
        success: false,
        message: error.message,
})
}
}

export {authAdmin}