import express from "express"
import * as dotenv from 'dotenv'
import connectDb from "./config/database.js"
import { errorHandler } from "./middleware/errorHandler.js"
import cors from 'cors'

import followersRouter from "./routes/followersRoutes.js"
import userRouter from "./routes/userRoutes.js"

dotenv.config();
const port = process.env.PORT || 5000

connectDb()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cors())

app.use("/api/followers",followersRouter)
app.use("/api/users",userRouter)

app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})


