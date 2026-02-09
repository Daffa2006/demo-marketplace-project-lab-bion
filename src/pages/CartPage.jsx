// pages/CartPage.jsx
import { useNavigate, Link } from "react-router";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { formatRupiah } from "../helpers";
import { useCart } from "../hooks/useCart";
import Swal from "sweetalert2";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();

  const handleUpdateQuantity = (productId, newQuantity, stock) => {
    if (newQuantity < 1) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Quantity",
        text: "Quantity must be at least 1",
      });
      return;
    }

    if (newQuantity > stock) {
      Swal.fire({
        icon: "warning",
        title: "Stock Limit",
        text: `Only ${stock} items available in stock`,
      });
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    Swal.fire({
      icon: "question",
      title: "Remove Item?",
      text: `Remove ${productName} from cart?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
        Swal.fire({
          icon: "success",
          title: "Removed!",
          text: "Item removed from cart",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleCheckout = () => {
    navigate("/checkouts");
  };

  const getItemTotal = (item) => {
    return item.price * item.quantity;
  };

  if (cart.length === 0) {
    return (
      <div
        className="cart-empty"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "1rem",
        }}
      >
        <ShoppingBag size={64} color="#6b7280" />
        <h2>Your cart is empty</h2>
        <p style={{ color: "#6b7280" }}>Add some products to get started!</p>
        <Link to="/products" className="btn primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Continue Shopping</span>
        </button>
        <h1>Shopping Cart ({getCartItemsCount()} items)</h1>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              {/* Product Image */}
              <Link
                to={`/products/detail?id=${item.productId}`}
                className="cart-item-image"
              >
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              </Link>

              {/* Product Info */}
              <div className="cart-item-details">
                <div className="cart-item-info">
                  <Link to={`/products/detail?id=${item.productId}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="cart-item-price">{formatRupiah(item.price)}</p>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Stock: {item.stock} available
                  </p>
                </div>

                {/* Quantity Controls & Total */}
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          item.quantity - 1,
                          item.stock
                        )
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.productId,
                          parseInt(e.target.value) || 1,
                          item.stock
                        )
                      }
                      min="1"
                      max={item.stock}
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.stock
                        )
                      }
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    <span className="total-label">Subtotal</span>
                    <span className="total-price">
                      {formatRupiah(getItemTotal(item))}
                    </span>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.productId, item.name)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total ({getCartItemsCount()} items)</span>
            <span>{formatRupiah(getCartTotal())}</span>
          </div>

          <button
            className="btn primary"
            onClick={handleCheckout}
            style={{ width: "100%" }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
