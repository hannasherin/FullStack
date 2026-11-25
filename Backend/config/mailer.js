 import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

console.log("EMAIL:", process.env.EMAIL ? "Loaded" : "Missing")
console.log("PASSWORD:", process.env.EMAIL_PASS ? "Loaded" : "Missing")

export default transporter