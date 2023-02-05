import asyncHandler from "express-async-handler"
import followersModel from "../models/followersSchema.js"
import userModel from '../models/userSchema.js'

// GET FOLLOWERS
export const getFollowers = asyncHandler(async(req,res) =>{
    const userFollowers = await followersModel.find({user:req.user.id})
    res.status(200).json({userFollowers})
})

// UPDATE FOLLOWERS
export const updateFollowers = asyncHandler(async(req,res)=>{
    const userFollowers = await followersModel.find({user:req.user.id})
    let followersArr = userFollowers[0].followers

    if(!req.user){
        res.status(401)
        throw new Error("User not Found")
    }
    let updatedFollowersArr = []
    let isThere = false
    followersArr.forEach((id)=>{
      if(id !== req.params.id){
        updatedFollowersArr.push(id)
      }else{
        isThere = true
      }  
    })

    if(!isThere){
        updatedFollowersArr.push(req.params.id)
    }
    userFollowers[0].followers = updatedFollowersArr
    const updatedFollowers = await followersModel.findByIdAndUpdate(userFollowers[0]._id,userFollowers[0],{new:true})
    res.status(200).json(updatedFollowers)
})

// DELETE FOLLOWERS
export const deleteFollowers = asyncHandler(async(req,res)=>{
    const followersId = await followersModel.findById(req.params.id)
    if(!followersId){
        res.status(400)
        throw new Error("Followers not found")
    }

    const user = await userModel.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error("User not Found")
    }

    if(followersId.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("User not authorized")
    }

    await followersId.remove()
    res.status(200).json(`Delete request on id ${req.params.id}`)
})