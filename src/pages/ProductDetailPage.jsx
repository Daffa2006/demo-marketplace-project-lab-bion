// pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ShoppingCart, CreditCard, ArrowLeft, Edit } from "lucide-react";
import { formatRupiah } from "../helpers";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // ============================================
      // TODO: FETCH API
      // ============================================
      /*
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://your-api.com/api/products/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
      */
      // ============================================

      // MOCK DATA - Hapus saat sudah pakai API
      setTimeout(() => {
        setProduct({
          id: id,
          name: "Samsung Galaxy S24 Ultra",
          price: 15999000,
          stock: 25,
          category: "Electronics",
          isFeatured: true,
          description:
            "Flagship smartphone dengan kamera 200MP, layar Dynamic AMOLED 2X 6.8 inch, prosesor Snapdragon 8 Gen 3, RAM 12GB, dan storage 256GB. Dilengkapi dengan S Pen, baterai 5000mAh, dan fast charging 45W.",
          images: [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1592286927505-eb0e1b9c6c90?w=800&h=800&fit=crop",
            "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop",
          ],
        });
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    console.log("Add to cart:", { productId: id, quantity });
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log("Checkout:", { productId: id, quantity });
    alert(`Proceeding to checkout with ${quantity} item(s)`);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.stock, value));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products/lists")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="product-detail-wrapper">
        {/* Image Gallery Section */}
        <div className="product-gallery">
          <figure className="main-image">
            <img
              src={product.images[selectedImage]}
              alt={`${product.name} - Image ${selectedImage + 1}`}
            />
            {product.isFeatured && (
              <span className="featured-badge">Featured</span>
            )}
          </figure>

          <div className="thumbnail-gallery">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={selectedImage === index ? "active" : ""}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="product-info">
          <div className="product-header">
            <div>
              <span className="product-category">{product.category}</span>
              <h1 className="product-name">{product.name}</h1>
            </div>
            <Link to={`/products/edit/${product.id}`} className="edit-button">
              <Edit size={20} />
            </Link>
          </div>

          <div className="product-price-section">
            <span className="price-label">Price</span>
            <span className="price-value">{formatRupiah(product.price)}</span>
          </div>

          <div className="product-details">
            <div className="detail-item">
              <span className="detail-label">Stock</span>
              <span className="detail-value">
                {product.stock > 0 ? (
                  <span className="stock-available">
                    {product.stock} units available
                  </span>
                ) : (
                  <span className="stock-unavailable">Out of stock</span>
                )}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{product.category}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Product ID</span>
              <span className="detail-value">#{product.id}</span>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="product-actions">
            <button
              className="btn secondary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button
              className="btn primary"
              onClick={handleCheckout}
              disabled={product.stock === 0}
            >
              <CreditCard size={20} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
