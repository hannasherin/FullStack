import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true

    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:String,
    otp:String,
    otpExpire:Date,
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    isVerified:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model('User',userSchema)