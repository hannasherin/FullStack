import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import API from "../api/axios";
// import { useAuth } from "../hooks/useAuth.js";


function Login() {

    const navigate = useNavigate();
    // const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await API.post(
                "/auth/login",
                formData
            );


            await login(response.data.token);
            // localStorage.setItem(
            //     "token",
            //     response.data.token
            // );

            navigate("/products", {
                replace: true
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
<div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    <LogIn size={28} />
                </div>

                <h2>Welcome Back</h2>

                <p className="auth-subtitle">
                    Login to manage your products.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

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
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-btn"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/signup">Create Account</Link>
                </p>

            </div>

        </div>
    );
}

export default Login;