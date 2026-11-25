import express from 'express'
import authMiddleware from '../middleware/authmiddleware.js'
import { signup,verifyOtp,login,forgotPassword,resetPassword,two_fa_login,verify2faOtp,getMe} from '../controllers/authController.js'
const router=express.Router()

router.post('/signup',signup)
router.post('/verify-otp',verifyOtp)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:token',resetPassword)
router.post('/2fa-login',two_fa_login)
router.post('/verify_2fa_otp',verify2faOtp)
router.get('/me',authMiddleware,getMe)

export default router