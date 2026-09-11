import jwt from "jsonwebtoken"

const authDoctor =async(req,res,next)=>{
try{
const {dtoken} =req.headers
 if(!dtoken){
    return res.status(400).json({
        success: false,
        message: "Invalid credential as user",
})
 }
 const token_decode =jwt.verify(dtoken,process.env.JWT_SECRET)
  req.body.docId = token_decode.id

 next()
}catch(error){
    console.log('Error',error);
return res.status(400).json({
        success: false,
        message: error.message,
})
}
}

export {authDoctor}