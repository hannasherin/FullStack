import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app=express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())
app.use(cors({
    origin:' http://localhost:5173',
    credentials:true
}))

connectDb()

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/products',productRoutes)


app.use(errorHandler)

 

app.listen(process.env.PORT,()=>console.log('server running...'))