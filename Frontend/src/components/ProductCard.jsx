import { Package } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ProductCard({ product }) {

    const getImageUrl = (image) => {

        if (!image) return null;

        if (image.startsWith("http")) {
            return image;
        }

        return `${SERVER_URL}/uploads/${image.replace(/^\/+/, "")}`;
    };

    return (

        <div className="product-card">

            <div className="product-card-image">

                {product.image ? (

                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        loading="lazy"
                    />

                ) : (

                    <div className="placeholder-image">
                        <Package size={40} />
                        <span>No Image</span>
                    </div>

                )}

            </div>

            <div className="product-card-content">

                <span className="product-category">
                    {product.category}
                </span>

                <h3>{product.name}</h3>

                <p className="product-description">
                    {product.description}
                </p>

                <div className="product-card-footer">

                    <h3>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </h3>

                    <span className="stock-badge">
                        Stock: {product.stock ?? 0}
                    </span>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;