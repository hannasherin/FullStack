import { Navigate, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import VerifyOtp from "./pages/VerifyOtp"
import Login from "./pages/Login"
import ProductList from "./pages/ProductList"
import CreateProduct from "./pages/CreateProduct"
import Navbar from "./components/Navbar"
function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={
          <>
          <ProductList /> 
          <Navbar />
          </>
        } />
        <Route path="/create-product" element={<CreateProduct />} />


      </Routes>

    </>
  )
}

export default App
