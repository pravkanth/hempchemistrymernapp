import mongoose from "mongoose";

const followersSchema = mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'goal'
        },
        followers:{
            type:[String],
            required:[true,"Please add a text field"],
        },
    },
    {timestamps:true,}
)

const followersModel = mongoose.model("Followers",followersSchema)
export default followersModel