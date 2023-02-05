import jwt from "jsonwebtoken"
import bycrypt from 'bcryptjs'
import userModel from "../models/userSchema.js"
import asyncHandler from "express-async-handler"
import followersModel from "../models/followersSchema.js"

// REGISTER USER
export const registerUser = asyncHandler(async(req,res) =>{
    const {fullName,userName,profileImg,email,password} = req.body;
    if(!fullName|| !userName || !email || !password){
        res.status(400)
        throw new Error("Please add all fields")
    }
    const userExists = await userModel.findOne({email})
    const userNameExists = await userModel.findOne({userName})

    if(userNameExists){
        res.status(400)
        throw new Error("User Name already exists")
    }
    if(userExists){
        res.status(400)
        throw new Error("Email already exists")
    }

    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password,salt)

    const user = await userModel.create({
        fullName,
        userName,
        profileImg,
        email,
        password:hashedPassword
    })

    await followersModel.create({
        user:user.id,
        followers : []
    })
    if(user){
        res.status(201).json({
            _id:user.id,
            fullName:user.fullName,
            userName:user.userName,
            profileImg:user.profileImg,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

// LOGIN USER
export const loginUser = asyncHandler(async(req,res) =>{

    const {email,password} = req.body;

    const user = await userModel.findOne({email})

    if(user && (await bycrypt.compare(password,user.password))){
        res.status(201).json({
            _id:user.id,
            fullName:user.fullName,
            userName:user.userName,
            profileImg:user.profileImg,
            email:user.email,
            token:generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid Credential")
    }
})

// GET ME
export const getMe = asyncHandler(async(req,res) =>{
    const {_id,email,fullName,userName,profileImg} = await userModel.findById(req.user.id)

    res.status(200).json(
        {
            id:_id,fullName,userName,profileImg,email
        }
    )
})

// GET ALL USERS
export const getAllUsers = asyncHandler(async(req,res)=>{
    const allUser = await userModel.find();
    res.status(200).json(allUser)

})

// UPDATE USER
export const updateUser = asyncHandler(async(req,res)=>{
    const {fullName,userName,profileImg,email,password} = req.body;
    if(!fullName|| !userName || !email || !password){
        res.status(400)
        throw new Error("Please add all fields")
    }

    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password,salt)

    const user = {
        _id:req.user.id,
        fullName,
        userName,
        profileImg,
        email,
        password:hashedPassword
    }

    if(user){
        const updatedUser = await userModel.findByIdAndUpdate(req.user.id,user,{new:true})
        res.status(200).json(updatedUser)
    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

// DELETE USER 
export const deleteUser = asyncHandler(async(req,res)=>{
    const user = await userModel.findById(req.params.id)
    if(!req.user){
        res.status(401)
        throw new Error("User not Found")
    }

    if(user.id !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
    await user.remove()
    const userFollowing = await followersModel.find({user:req.user.id})
    await followersModel.findByIdAndRemove(userFollowing._id)

    res.status(200).json(`Delete request on id ${req.params.id}`)
})

// TOKEN
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{ expiresIn:"1d"})
}