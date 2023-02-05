import express from 'express'
import { registerUser,
        loginUser,
        getAllUsers,
        getMe,
        updateUser,
        deleteUser } from '../controllers/userController.js'

import protect from '../middleware/authMiddleware.js'
const userRouter = express.Router()
/*
    /api/users --> Route
*/
userRouter.get("/",getAllUsers)
userRouter.post("/",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/me",protect,getMe)
userRouter.put("/update",protect,updateUser)
userRouter.delete("/:id",protect,deleteUser)

export default userRouter