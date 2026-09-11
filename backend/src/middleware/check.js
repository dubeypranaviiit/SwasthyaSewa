 const dataCheck =(req,res,next)=>{
    const {name,email,password,degree,experience,speciality,fees,about}= req.body
    const imageFile=req.file
    if(!name || !email || !password  || !degree ||  !fees ){
        return res.status(400).json({
            success: false,
            message: "Please fill all the data carefully",
        
        })
    }
    else{
        next()
    }
 }
 export { dataCheck}
