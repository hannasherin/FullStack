export const getDashboard=async(req,res)=>{
    try {
        res.status(200).json({message:"dashboard data"})        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }   
}