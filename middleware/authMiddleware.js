import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import userModel from '../models/userSchema.js'

const protect = asyncHandler(async(req,res,next)=>{
    let token;
    let tempAuth = req.headers.authorization?req.headers.authorization:req.body.headers.Authorization
    if(tempAuth && tempAuth.startsWith("Bearer")){
        try {
            token = tempAuth.split(" ")[1]

            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await userModel.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error("Not authorized")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})

export default protect