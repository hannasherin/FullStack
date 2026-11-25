import User from '../models/User.js'
import bcrypt from 'bcrypt'
import transpoter from '../config/mailer.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import AppError from '../utilitis/AppError.js'

const generateOtp=()=>{
   return  Math.floor(100000+Math.random()*900000).toString()
}
export const signup=async(req,res)=>{
    try {
        const {name,email,password,phone}=req.body;
        if(!name || !email || !password || !phone){
           return res.status(400).json({message:"name,email and password required"})
        }
        const userExist=await User.findOne({email})
        if(userExist){
           return  res.status(400).json({message:"user already exist"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const otp=generateOtp()
        const user=new User({
            name,
            email,
            password:hashedPassword,
            phone,
            otp
        
        })

        await user.save();
        //sending otp to mail
        await transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Verify your accound",
            text:`your otp is ${otp}` 
        })


        res.status(201).json({messae:"signup successful,verify your account"})


    } catch (error) {
    console.log("SIGNUP ERROR:", error)

    res.status(500).json({
        message: error.message
    })
}
}  

export const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body;
        if(!email || !otp) {
            return res.status(400).json({message:"email and otp required"})
        }
        const user=await User.findOne({email}) 
        if(!user){
            return res.status(400).json({message:"user not found"})
        }  
        if(user.otp!==otp){
            return res.status(400).json({message:"invalid otp"})
        }
        user.otp=null;
        user.isVerified=true;
        await user.save();
        res.status(200).json({message:"otp verified successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
}

export const login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            // return res.status(400).json({messae:"email and password required"})
            return next(new AppError(400,"Email and Password Required"))
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({messae:"invalid credentials"})
        }
        if(!user.isVerified){
            return res.status(403).json({messae:"please verify your account"})
        }

        const passwordMatch=await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(401).json({messae:"Invalid credentials"})
        }
      
  const token=jwt.sign(
    {userId:user._id},
    process.env.JWT_KEY,
    {expiresIn:"1h"}
  )

        res.status(200).json({success:true,message:"login successful",token})

    } catch (error) {
        // res.status(500).json({message:"server error"})
        next(error)
    }
}

export const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({messae:"email is required"})
        }
        const user=await User.findOne({email:email.trim().toLowerCase()})
        if(!user){
            return res.status(200).json({message:"if the email exists, a reset link will be sent"})
        }
        const resetToken=crypto.randomBytes(32).toString('hex')
       
        const hashedToken=crypto    
                            .createHash("sha256")
                            .update(resetToken)
                            .digest("hex")

        const tokenExpire=Date.now()+ 5*60*1000
        user.resetPasswordToken=hashedToken;
        user.resetPasswordExpire=tokenExpire;
        await user.save();
        
        const resetUrl=`${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`
        await transpoter.sendMail({
            from:process.env.EMAIL,
            to:user.email,
            subject:"Reset Your Password",
            text:`Reset your password using this link : ${resetUrl}`
        })

        res.status(200).json({message:"reset password link will sent your email"})

    } catch (error) {
        // res.status(500).json({message:"server error"})
        // console.log(error)
           next(error)
    }
}

export const resetPassword=async(req,res)=>{
    try {
        const {token}=req.params;
        const {password}=req.body;
        if(!token || !/^[a-f0-9]{64}/.test(token)){
            return res.status(400).json({message:"Invalid reset token"})
        }
        if(typeof password!=='string' ||password.length<8){
            return res.status(400).json({message:"password must contain atleast 8 charecters"})
        }
        const hashedToken=crypto
                            .createHash('sha256')
                            .update(token)
                            .digest('hex')
        
        
        const user=await User.findOne({
            resetPasswordToken:hashedToken,
            resetPasswordExpire:{$gt:new Date()}
        })

        if(!user){
            return res.status(400).json({messae:'Invalid or Expired token'})
        }
        
        user.password=await bcrypt.hash(password,10)
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save()
        
        res.status(200).json({message:"password reset successful"})

 
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
        
    }
}

export const two_fa_login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(typeof email!=='string' || typeof password!=='string'||
            !email.trim()||!password
        ){
           return res.status(400).json({message:"Email and password are required"}) 
        }

        const user=await User.findOne({email:email.trim().toLocaleLowerCase()})
        if(!user){
            return res.status(401).json({message:'invalid email or password'})
        }
        if(!user.isVerified){
            return res.status(403).json({messae:"please verify your account"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message:'invalid email or password'})
 
        }
        const otp=crypto.randomInt(100000,1000000).toString()
        const hashedOtp=await bcrypt.hash(otp,10)
        user.otp=hashedOtp;
        user.otpExpire=Date.now()+5*60*1000
        await user.save()
        await transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:"Login verification OTP",
            text:`Your login OTP is ${otp}.It expires in 5 minutes.
            Do not share this OTP with anyone
            `
        })

        res.status(200).json({message:"If the account is eligible,an otp has been sent",userId:user._id})


    } catch (error) {
        res.status(500).json({message:"server error"})
 
    }
}


export const verify2faOtp=async(req,res)=>{
    try {
       const {otp,userId}=req.body;
       if(!otp || !userId){
        return res.status(400).json({message:"all fields are required"})
       } 
       const user=await User.findById(userId)
       if(!user){
        return res.status(401).json({message:"Invalid verification request"})
       }
       if(!user.otp || !user.otpExpire){
        return res.status(400).json({message:"OTP is not found"})
       }
       if(Date.now()>user.otpExpire){
        user.otp=undefined
        user.otpExpire=undefined
        await user.save()
        return res.status(400).json({message:"OTP expired , please login again"})
       }
       const isOtpMatch=await bcrypt.compare(otp,user.otp)
       if(!isOtpMatch){
        return res.status(400).json({message:"Invalid otp"})
       }
       user.otp=undefined
       user.otpExpire=undefined
       await user.save()
       res.status(200).json({message:"LOgin successfully"})
    } catch (error) {
        res.status(500).json({message:"server Error"})
    }
}

export const  getMe=async(req,res,next)=>{
    try {
         const user=await User.findById(req.user.userId)
         .select('-password -otp -otpExpire')

         if(!user){
            return next(new AppError($01,'user no longer exists'))
         }
         res.status(200).json({user})
    } catch (error) {
        next(error)
    }
}