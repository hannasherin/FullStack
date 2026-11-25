import React, { useState } from 'react'
import { replace, useLocation, useNavigate , Link} from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import API from '../api/axios'

const VerifyOtp = () => {


  const navigate=useNavigate()
  const location=useLocation()

  const email=location.state?.email || ""

  const[otp,setOtp]=useState("")
  const[error,setError]=useState("")
  const[loading,setLoading]=useState(false)

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("")
    setLoading(true)


    try {
        
    await API.post("/auth/verify-otp",{
        email,
        otp
    })
    navigate("/login",{
        replace:true
    })

    } catch (error) {
        setError(error.response?.data?.message || 
            "Invalid Otp, Please try again" )

    }
    finally{
    setLoading(false)
  }
  } 


  return (
   <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    <MailCheck size={28} />
                </div>

                <h2>Verify Your Email</h2>

                <p className="auth-subtitle">
                    Enter the verification code sent to:
                </p>

                <p className="verified-email">
                    {email || "Email not available"}
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Verification OTP</label>

                        <input
                            type="text"
                            placeholder="Enter 6 digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            inputMode="numeric"
                            maxLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email || otp.length !== 6}
                        className="primary-btn"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                </form>

                <p className="auth-footer">
                    Back to <Link to="/signup">Signup</Link>
                </p>

            </div>

        </div>
  )
}

export default VerifyOtp
