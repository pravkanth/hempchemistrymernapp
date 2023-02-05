import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
    {
        fullName :{
            type:String,
            required:[true,"Please enter the full Name"]
        },
        userName :{
            type:String,
            required:[true,"Please enter the User Name"]
        },
        profileImg :{
            type:String,
        },
        email :{
            type:String,
            required:[true,"Please enter the Email"],
            unique:true,
        },
        password :{
            type:String,
            required:[true,"Please enter the Password"]
        },
    },{
        timestamps:true
    }
)

const userModel = mongoose.model("Accounts",userSchema)
export default userModel