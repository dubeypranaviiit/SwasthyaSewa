import jwt from "jsonwebtoken"

const authUser =async(req,res,next)=>{
try{
const {token} =req.headers
 if(!token){
    return res.status(400).json({
        success: false,
        message: "Invalid credential as user",
})
 }
 const token_decode =jwt.verify(token,process.env.JWT_SECRET)
  req.body.userId = token_decode.id

 next()
}catch(error){
return res.status(400).json({
        success: false,
        message: error.message,
})
}
}

export {authUser}