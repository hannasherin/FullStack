import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import API from '../api/axios';
import { UserPlus } from 'lucide-react';


const Signup = () => {

const navigate=useNavigate()
const [formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    phone:""
});

const[error,setError]=useState("")
const[loading,SetLoading]=useState(false)

const handleChange=(e)=>{
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
}

const  handleSubmit= async(e)=>{
    e.preventDefault();

   setError("");
   SetLoading(true);

   try {
    
     const response=await API.post("/auth/signup",formData)

     navigate("/verify-otp",{
        state:{
            email:formData.email
        }
     })

   } catch (error) {
    setError(error.response?.data?.message ||
        "Signup Failed.please try again"
    )
   }finally{
    SetLoading(false)
   }

}



  return (
    <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    <UserPlus size={28} />
                </div>

                <h2>Create Account</h2>

                <p className="auth-subtitle">
                    Create your account to get started.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-btn"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>

        </div>
  )
}

export default Signup
