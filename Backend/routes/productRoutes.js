import express from 'express'
import authMiddleware from '../middleware/authmiddleware.js'
import{createProduct , getProducts} from '../controllers/productController.js'
import upload from '../middleware/upload.js'
const router=express.Router()

router.post('/',upload.single('image'),createProduct)
router.get('/',getProducts)

export default router