import jwt from 'jsonwebtoken'
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:"Access denined,token missing"})
    }

    const [scheme,token]=authHeader.split(' ')      //["bearer","dsfhaskdjfhaksldfj"]
    if(scheme!=='Bearer'||!token){
        return res.status(401).json({message:"Invalid authorization format"})

    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_KEY)  //{userId:user._id}
        req.user=decoded;
        next();
        
    } catch (error) {
        res.status(401).json({message:"Invalid or expired token"})
    }
}

export default authMiddleware