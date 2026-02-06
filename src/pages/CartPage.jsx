// pages/CartPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { formatRupiah } from "../helpers";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      // ============================================
      // TODO: FETCH CART API
      // ============================================
      /*
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://your-api.com/api/cart", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        setCartItems(data.items);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
      */
      // ============================================

      // MOCK DATA - Hapus saat sudah pakai API
      setTimeout(() => {
        setCartItems([
          {
            id: 1,
            productId: "p1",
            name: "Samsung Galaxy S24 Ultra",
            price: 15999000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
            stock: 25,
            category: "Electronics",
          },
          {
            id: 2,
            productId: "p2",
            name: "iPhone 15 Pro Max",
            price: 19999000,
            quantity: 2,
            image:
              "https://images.unsplash.com/photo-1592286927505-eb0e1b9c6c90?w=300&h=300&fit=crop",
            stock: 15,
            category: "Electronics",
          },
          {
            id: 3,
            productId: "p3",
            name: "Sony WH-1000XM5",
            price: 4999000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop",
            stock: 50,
            category: "Electronics",
          },
        ]);
        setLoading(false);
      }, 500);
    };

    fetchCart();
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    // ============================================
    // TODO: UPDATE QUANTITY API
    // ============================================
    /*
    const token = localStorage.getItem("token");
    await fetch(`https://your-api.com/api/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity: newQuantity })
    });
    */
    // ============================================

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.stock, newQuantity)),
            }
          : item,
      ),
    );
  };

  const removeItem = (itemId) => {
    // ============================================
    // TODO: REMOVE ITEM API
    // ============================================
    /*
    const token = localStorage.getItem("token");
    await fetch(`https://your-api.com/api/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    */
    // ============================================
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    // ============================================
    // TODO: CHECKOUT API
    // ============================================
    console.log("Checkout items:", cartItems);
    alert(
      `Checkout ${cartItems.length} items with total ${formatRupiah(getTotalPrice())}`,
    );
  };

  const getItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
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
        <h1>Shopping Cart ({getTotalItems()} items)</h1>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              {/* Product Image */}
              <Link
                to={`/products/${item.productId}`}
                className="cart-item-image"
              >
                <img src={item.image} alt={item.name} />
              </Link>

              {/* Product Info */}
              <div className="cart-item-details">
                <div className="cart-item-info">
                  <Link to={`/products/${item.productId}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <span className="cart-item-category">{item.category}</span>
                  <p className="cart-item-price">{formatRupiah(item.price)}</p>
                </div>

                {/* Quantity Controls & Total */}
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      min="1"
                      max={item.stock}
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                    onClick={() => removeItem(item.id)}
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
            <span>Total ({getTotalItems()} items)</span>
            <span>{formatRupiah(getTotalPrice())}</span>
          </div>

          <Link
            className="btn primary"
            to="/checkouts"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
