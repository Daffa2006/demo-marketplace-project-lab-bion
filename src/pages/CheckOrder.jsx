// pages/CheckOrderPage.jsx
import { useState } from "react";
import {
  Search,
  Package,
  Calendar,
  User,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import Input from "../components/Input";
import { formatRupiah } from "../helpers";
export default function CheckOrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Masukkan Order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrderData(null);

    // ============================================
    // TODO: SEARCH ORDER API
    // ============================================
    /*
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://your-api.com/api/orders/${searchQuery}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const data = await response.json();
      setOrderData(data);
      setLoading(false);
    } catch (err) {
      setError("Order tidak ditemukan. Periksa kembali Order ID.");
      setLoading(false);
    }
    */
    // ============================================

    // MOCK DATA - Hapus saat sudah pakai API
    setTimeout(() => {
      if (searchQuery === "ORD-123456") {
        setOrderData({
          orderId: "ORD-123456",
          status: "pending", // pending, confirmed, shipped, delivered, cancelled
          createdAt: "2025-02-06T10:30:00Z",
          customerInfo: {
            name: "Daffa Anaqi Farid",
            address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
            phone: "083897685406",
          },
          items: [
            {
              id: 1,
              name: "Samsung Galaxy S24 Ultra",
              price: 15999000,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&h=300&fit=crop",
            },
            {
              id: 2,
              name: "Iphone",
              price: 19999000,
              quantity: 2,
              image:
                "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
            {
              id: 3,
              name: "Sony WH-1000XM5",
              price: 4999000,
              quantity: 1,
              image:
                "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop",
            },
          ],
          totalPrice: 60996000,
          notes: "Mohon dikirim secepatnya",
        });
        setLoading(false);
      } else {
        setError(
          "Order tidak ditemukan. Gunakan Order ID: ORD-123456 untuk testing.",
        );
        setLoading(false);
      }
    }, 800);
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    if (error) setError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Menunggu Konfirmasi", color: "#f59e0b" },
      confirmed: { label: "Dikonfirmasi", color: "#3b82f6" },
      shipped: { label: "Dalam Pengiriman", color: "#8b5cf6" },
      delivered: { label: "Selesai", color: "#10b981" },
      cancelled: { label: "Dibatalkan", color: "#ef4444" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.label}
      </span>
    );
  };

  const updateOrderStatus = async (newStatus) => {
    // ============================================
    // TODO: UPDATE ORDER STATUS API
    // ============================================
    /*
    const token = localStorage.getItem("token");
    await fetch(`https://your-api.com/api/orders/${orderData.orderId}/status`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    });
    */
    // ============================================

    setOrderData((prev) => ({ ...prev, status: newStatus }));
    alert(`Order status updated to: ${newStatus}`);
  };

  return (
    <div className="check-order-container">
      <div className="check-order-header">
        <h1>Check Order</h1>
        <p>Masukkan Order ID untuk melihat detail pesanan</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <Input
            name="search"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Masukkan Order ID (contoh: ORD-123456)"
            error={error}
          />
        </div>
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Order Receipt */}
      {orderData && (
        <div className="order-receipt">
          {/* Receipt Header */}
          <div className="receipt-header">
            <div>
              <h2>Order Receipt</h2>
              <p className="order-id">#{orderData.orderId}</p>
            </div>
            {getStatusBadge(orderData.status)}
          </div>

          {/* Order Info */}
          <div className="order-info-grid">
            <div className="info-item">
              <Calendar size={18} />
              <div>
                <span className="info-label">Order Date</span>
                <span className="info-value">
                  {formatDate(orderData.createdAt)}
                </span>
              </div>
            </div>

            <div className="info-item">
              <User size={18} />
              <div>
                <span className="info-label">Customer Name</span>
                <span className="info-value">
                  {orderData.customerInfo.name}
                </span>
              </div>
            </div>

            <div className="info-item">
              <Phone size={18} />
              <div>
                <span className="info-label">Phone Number</span>
                <span className="info-value">
                  {orderData.customerInfo.phone}
                </span>
              </div>
            </div>

            <div className="info-item full-width">
              <MapPin size={18} />
              <div>
                <span className="info-label">Delivery Address</span>
                <span className="info-value">
                  {orderData.customerInfo.address}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="receipt-section">
            <h3>
              <ShoppingBag size={20} />
              Order Items
            </h3>
            <div className="order-items-list">
              {orderData.items.map((item) => (
                <div key={item.id} className="receipt-item">
                  <img src={item.image} alt={item.name} />
                  <div className="receipt-item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">
                      {formatRupiah(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="receipt-item-total">
                    {formatRupiah(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}

          <div className="summary-row total">
            <span>Total</span>
            <span>{formatRupiah(orderData.totalPrice)}</span>
          </div>

          {/* Admin Actions */}
          <div className="admin-actions">
            <h3>Update Order Status</h3>
            <div className="status-buttons">
              <button
                className="status-btn pending"
                onClick={() => updateOrderStatus("pending")}
                disabled={orderData.status === "pending"}
              >
                Pending
              </button>
              <button
                className="status-btn confirmed"
                onClick={() => updateOrderStatus("confirmed")}
                disabled={orderData.status === "confirmed"}
              >
                Confirm
              </button>
              <button
                className="status-btn shipped"
                onClick={() => updateOrderStatus("shipped")}
                disabled={orderData.status === "shipped"}
              >
                Ship
              </button>
              <button
                className="status-btn delivered"
                onClick={() => updateOrderStatus("delivered")}
                disabled={orderData.status === "delivered"}
              >
                Deliver
              </button>
              <button
                className="status-btn cancelled"
                onClick={() => updateOrderStatus("cancelled")}
                disabled={orderData.status === "cancelled"}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Notes */}
          {orderData.notes && (
            <div className="order-notes">
              <strong>Customer Notes:</strong>
              <p>{orderData.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
