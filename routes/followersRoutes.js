import express from "express"
import { getFollowers,updateFollowers,deleteFollowers } from "../controllers/followersController.js"
import protect from "../middleware/authMiddleware.js"

const followersRouter = express.Router()

/*
    /api/followers
*/

followersRouter.get("/me/",protect,getFollowers)
followersRouter.route("/:id").put(protect,updateFollowers).delete(protect,deleteFollowers)


export default followersRouter