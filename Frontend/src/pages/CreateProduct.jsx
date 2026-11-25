import React from 'react'
import { PackagePlus,ImagePlus,ArrowLeft } from 'lucide-react';
import { useNavigate,Link } from 'react-router-dom'
import { useState } from 'react';
import API from '../api/axios';

const CreateProduct = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: ""
    })

    const [image, setImaga] = useState(null)
    const [preview, setPreview] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return

        if (!file.type.startsWith("image/")) {
            setError("please select valid image")
            return
        }

        if (!file.size > 5 * 1024 * 1024) {
            setError("image must be smaller than 5MB")
            return
        }

        setError("")
        setImaga(file)
        const imageUrl = URL.createObjectURL(file)
        setPreview(imageUrl)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setError("")
        setLoading(true)
        try {

            const data = new FormData();

            Object.entries(formData).forEach(([Key, value]) => {
                data.append(Key, value)
            })
            if (image) {
                data.append("image", image)
            }

            const response = await API.post(
                "/products", data
            )
            alert(response.data.message)
            navigate("/products")

        } catch (error) {

           setError(
            error.response?.data?.message ||
            "unable to create product"
           )

        }
        finally{
            setLoading(false)
        }
    }


    return (
        <div className="dashboard-page">

            <div className="page-heading">

                <div>
                    <Link to="/products" className="back-button">
                        <ArrowLeft size={17} />
                        Back to Products
                    </Link>

                    <h1>Create Product</h1>

                    <p>
                        Add a new product to your inventory.
                    </p>
                </div>

            </div>

            <div className="form-card">

                <div className="form-card-heading">
                    <PackagePlus size={22} />

                    <div>
                        <h3>Product Information</h3>
                        <p>Enter the details of your product.</p>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Product Name *</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Example: Wireless Headphones"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>

                            <input
                                type="text"
                                name="category"
                                placeholder="Example: Electronics"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Price (₹) *</label>

                            <input
                                type="number"
                                name="price"
                                placeholder="Enter price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity</label>

                            <input
                                type="number"
                                name="stock"
                                placeholder="Enter stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Description *</label>

                        <textarea
                            name="description"
                            placeholder="Write a detailed product description..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>

                        <label className="upload-area">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Product preview"
                                    className="upload-preview"
                                />
                            ) : (
                                <>
                                    <ImagePlus size={35} />

                                    <span>Click to upload image</span>

                                    <small>
                                        PNG, JPG or WEBP (Max 5MB)
                                    </small>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageChange}
                                hidden
                            />

                        </label>
                    </div>

                    <div className="form-actions">

                        <Link to="/products" className="secondary-btn">
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default CreateProduct
