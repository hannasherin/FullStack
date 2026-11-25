import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, RefreshCw, Package } from "lucide-react";

import API from "../api/axios";
import ProductCard from "../components/ProductCard";

function ProductList() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await API.get("/products");

            setProducts(response.data.products || []);

        } catch (error) {

            // Your controller returns 400 when no products exist.
            if (error.response?.status === 400) {
                setProducts([]);
            } else {
                setError(
                    error.response?.data?.message ||
                    "Unable to fetch products"
                );
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const query = search.toLowerCase();

            return (
                product.name?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query)
            );

        });

    }, [products, search]);

    return (

        <div className="dashboard-page">

            <div className="page-heading">

                <div>
                    <h1>Product Inventory</h1>

                    <p>
                        Manage and view all your products in one place.
                    </p>
                </div>

                <Link
                    to="/create-product"
                    className="primary-btn add-product-btn"
                >
                    <Plus size={18} />
                    Add Product
                </Link>

            </div>

            <div className="inventory-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        <Package size={23} />
                    </div>

                    <div>
                        <p>Total Products</p>
                        <h2>{products.length}</h2>
                    </div>

                </div>

            </div>

            <div className="inventory-toolbar">

                <div className="search-box">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchProducts}
                    disabled={loading}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (

                <div className="loading-state">
                    Loading products...
                </div>

            ) : filteredProducts.length === 0 ? (

                <div className="empty-state">

                    <Package size={45} />

                    <h3>
                        {search ? "No matching products" : "No products found"}
                    </h3>

                    <p>
                        {search
                            ? "Try searching with another name or category."
                            : "Start by adding your first product."}
                    </p>

                    {!search && (
                        <Link
                            to="/create-product"
                            className="primary-btn"
                        >
                            <Plus size={18} />
                            Create Product
                        </Link>
                    )}

                </div>

            ) : (

                <div className="products-grid">

                    {filteredProducts.map((product) => (

                        <ProductCard
                            key={product._id}
                            product={product}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}

export default ProductList;