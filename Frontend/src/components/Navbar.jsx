import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link,NavLink,useNavigate } from 'react-router-dom'
const Navbar = () => {

    const navigate=useNavigate()
    const {logout}=useAuth()

    const handleLogout=()=>{
        logout()
        navigate("/login",{
            replace:true
        })
    }
  return (
   <nav className="navbar">

            <Link to="/products" className="brand">
                <ShoppingBag size={25} />

                <span>ShopAdmin</span>
            </Link>

            <div className="nav-links">

                <NavLink to="/products">
                    <Package size={18} />
                    Products
                </NavLink>

                <NavLink to="/create-product">
                    <Plus size={18} />
                    Create Product
                </NavLink>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </nav>
  )
}

export default Navbar
