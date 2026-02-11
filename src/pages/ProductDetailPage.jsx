// pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router";
import {
  ShoppingCart,
  CreditCard,
  ArrowLeft,
  Edit,
  Loader2,
  User,
} from "lucide-react";
import { formatRupiah } from "../helpers";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import api from "../lib/axios";
import Swal from "sweetalert2";
import AdminOnly from "../routes/AdminOnly";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Product",
        text: "Product ID is missing",
      }).then(() => {
        navigate("/products");
      });
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      console.error("Fetch product error:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to load product";

      Swal.fire({
        icon: "error",
        title: "Failed to Load Product",
        text: errorMessage,
      }).then(() => {
        navigate("/products");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (!product) return;

    try {
      addToCart(product, quantity);
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `Added ${quantity} ${product.name} to cart!`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add",
        text: "Failed to add item to cart",
      });
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to checkout",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // Add to cart first, then navigate to checkout
    if (product) {
      addToCart(product, quantity);
      navigate("/checkouts");
    }
  };

  const handleQuantityChange = (value) => {
    if (!product) return;
    const newQuantity = Math.max(1, Math.min(product.stock, value));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div
        className="product-detail-loading"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "1rem",
        }}
      >
        <Loader2 className="spin" size={48} />
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="product-detail-error"
        style={{
          textAlign: "center",
          padding: "3rem",
        }}
      >
        <h2>Product not found</h2>
        <button className="btn primary" onClick={() => navigate("/products")}>
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
              src={
                import.meta.env.VITE_BACKEND_BASE_URL +
                product.images?.[selectedImage]
              }
              alt={`${product.name} - Image ${selectedImage + 1}`}
            />
            {product.isFeatured && (
              <span className="featured-badge">Featured</span>
            )}
          </figure>

          {product.images && product.images.length > 1 && (
            <div className="thumbnail-gallery">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={import.meta.env.VITE_BACKEND_BASE_URL + image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={selectedImage === index ? "active" : ""}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <AdminOnly>
              <Link
                to={`/products/edit/${product._id}`}
                className="edit-button"
              >
                <Edit size={20} />
              </Link>
            </AdminOnly>
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

            {product.seller && (
              <div className="detail-item">
                <span className="detail-label">
                  <User
                    size={16}
                    style={{ display: "inline", marginRight: "0.25rem" }}
                  />
                  Seller
                </span>
                <span className="detail-value">
                  {product.seller.name}
                  {product.seller.email && (
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        display: "block",
                      }}
                    >
                      {product.seller.email}
                    </span>
                  )}
                </span>
              </div>
            )}

            {product.ratings && (
              <div className="detail-item">
                <span className="detail-label">Rating</span>
                <span className="detail-value">
                  {product.ratings.average > 0
                    ? `⭐ ${product.ratings.average.toFixed(1)} (${product.ratings.count} reviews)`
                    : "No ratings yet"}
                </span>
              </div>
            )}

            <div className="detail-item">
              <span className="detail-label">Product ID</span>
              <span className="detail-value">#{product._id}</span>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || "No description available"}</p>
          </div>

          {/* Quantity Selector - Only show when authenticated */}
          {isAuthenticated && product.stock > 0 && (
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

          {/* Action Buttons - Only show when authenticated */}
          {isAuthenticated ? (
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
          ) : (
            <div
              className="login-prompt"
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--color-muted-light)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 1rem 0",
                  color: "var(--color-foreground)",
                }}
              >
                Please login to purchase this product
              </p>
              <button
                className="btn primary"
                onClick={() => navigate("/login")}
                style={{ margin: "0 auto" }}
              >
                Login to Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
