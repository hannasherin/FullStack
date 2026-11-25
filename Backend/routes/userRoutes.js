import express from 'express'
import { getDashboard } from '../controllers/userController.js'
import authMiddleware from '../middleware/authmiddleware.js';
const router=express.Router();

router.get('/dashboard',authMiddleware,getDashboard)

export default router